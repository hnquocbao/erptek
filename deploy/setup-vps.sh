#!/usr/bin/env bash
# One-time setup for an Ubuntu VPS that serves erptek.net with Caddy.
# Run as root (or with sudo) from a folder that also contains Caddyfile:
#   sudo bash setup-vps.sh "ssh-ed25519 AAAA... github-actions-deploy"
# The argument is the PUBLIC key whose private half is stored in GitHub as VPS_SSH_KEY.
set -euo pipefail

DEPLOY_USER="deploy"
SITE_DIR="/var/www/erptek"
HERE="$(cd "$(dirname "$0")" && pwd)"
PUBKEY="${1:-}"

if [[ $EUID -ne 0 ]]; then echo "Run as root: sudo bash $0 \"<public key>\"" >&2; exit 1; fi
if [[ -z "$PUBKEY" ]]; then echo "Pass the deploy PUBLIC key as the first argument." >&2; exit 1; fi
if [[ ! -f "$HERE/Caddyfile" ]]; then echo "Caddyfile not found next to this script." >&2; exit 1; fi

echo "==> Installing Caddy (official apt repo) and rsync"
apt-get update -y
apt-get install -y debian-keyring debian-archive-keyring apt-transport-https curl gnupg rsync
if [[ ! -f /usr/share/keyrings/caddy-stable-archive-keyring.gpg ]]; then
  curl -1sLf 'https://dl.cloudsmith.io/public/caddy/stable/gpg.key' | gpg --dearmor -o /usr/share/keyrings/caddy-stable-archive-keyring.gpg
  curl -1sLf 'https://dl.cloudsmith.io/public/caddy/stable/debian.deb.txt' > /etc/apt/sources.list.d/caddy-stable.list
  chmod o+r /usr/share/keyrings/caddy-stable-archive-keyring.gpg /etc/apt/sources.list.d/caddy-stable.list
  apt-get update -y
fi
apt-get install -y caddy

echo "==> Creating deploy user '$DEPLOY_USER' (key login only, no sudo)"
if ! id "$DEPLOY_USER" >/dev/null 2>&1; then
  adduser --disabled-password --gecos "" "$DEPLOY_USER"
fi
install -d -m 700 -o "$DEPLOY_USER" -g "$DEPLOY_USER" "/home/$DEPLOY_USER/.ssh"
AUTH="/home/$DEPLOY_USER/.ssh/authorized_keys"
touch "$AUTH"
grep -qxF "$PUBKEY" "$AUTH" || echo "$PUBKEY" >> "$AUTH"
chown "$DEPLOY_USER:$DEPLOY_USER" "$AUTH"
chmod 600 "$AUTH"

echo "==> Preparing $SITE_DIR"
install -d -m 755 -o "$DEPLOY_USER" -g "$DEPLOY_USER" "$SITE_DIR" "$SITE_DIR/releases"
if [[ ! -e "$SITE_DIR/current" ]]; then
  install -d -m 755 -o "$DEPLOY_USER" -g "$DEPLOY_USER" "$SITE_DIR/releases/placeholder"
  echo '<!doctype html><title>ERPTEK</title><p>Deploying soon.</p>' > "$SITE_DIR/releases/placeholder/index.html"
  chown "$DEPLOY_USER:$DEPLOY_USER" "$SITE_DIR/releases/placeholder/index.html"
  sudo -u "$DEPLOY_USER" ln -s releases/placeholder "$SITE_DIR/current"
fi

echo "==> Installing Caddyfile"
install -m 644 "$HERE/Caddyfile" /etc/caddy/Caddyfile
caddy validate --config /etc/caddy/Caddyfile --adapter caddyfile
systemctl enable caddy
systemctl reload caddy || systemctl restart caddy

if command -v ufw >/dev/null 2>&1 && ufw status | grep -q "Status: active"; then
  echo "==> Opening ports 80 and 443 in ufw"
  ufw allow 80/tcp
  ufw allow 443/tcp
fi

echo
echo "Done. Next:"
echo "  1. Point DNS A records for erptek.net and www.erptek.net at this server's IP."
echo "  2. Add GitHub secrets VPS_HOST, VPS_USER=$DEPLOY_USER, VPS_SSH_KEY (and VPS_KNOWN_HOSTS)."
echo "  3. Push to main, or run the Deploy workflow by hand."
echo "Host key line for VPS_KNOWN_HOSTS (use your domain or IP in place of <host>):"
for f in /etc/ssh/ssh_host_ed25519_key.pub; do [[ -f $f ]] && echo "  <host> $(cut -d' ' -f1,2 "$f")"; done

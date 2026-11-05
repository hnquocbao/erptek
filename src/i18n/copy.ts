// All site copy, one object per language. `vi` must match the shape of `en`:
// the build fails when a string is missing.

export type Lang = 'en' | 'vi';
export const langs: Lang[] = ['en', 'vi'];
export const homePath: Record<Lang, string> = { en: '/', vi: '/vi/' };

// Submitted values stay in English so the leads sheet reads the same in both languages.
export const sizeValues = ['1–20 people', '21–100 people', '101–500 people', '500+ people'];

type Question = { id: string; q: string; a: string; bins: string[]; src: string[] };
type Aisle = { code: string; title: string; service: string; text: string; get: string[] };

const en = {
  meta: {
    title: 'ERPTEK | Get your company ready for AI',
    description:
      'ERPTEK prepares your data and workflows for AI, builds your company second brain, and gives every employee an AI assistant that works from it.',
    ogLocale: 'en_US',
  },
  skip: 'Skip to content',
  langSwitch: { label: 'Language', current: 'English' },
  nav: {
    label: 'Main',
    home: 'ERPTEK home',
    services: 'Services',
    method: 'Method',
    readiness: 'Readiness check',
    faq: 'FAQ',
    book: 'Book a call',
  },
  form: {
    email: 'Work email',
    emailPlaceholder: 'you@company.com',
    size: 'Company size',
    choose: 'Choose',
    sizes: ['1–20 people', '21–100 people', '101–500 people', '500+ people'],
    honeypot: 'Leave this empty',
  },
  hero: {
    title: 'Every answer your company has, labeled and on the shelf.',
    lede: "ERPTEK gets your data and workflows ready for AI, builds your company's second brain, and gives each employee an assistant that finds, checks and acts on what you already know.",
    stripTitle: 'Start with a free readiness call',
    submit: 'Book the call',
    rackCaption: 'Your files, put away and ready to pick',
    demo: 'Demo data',
    dockLabel: 'Receiving: unsorted files',
    dockSign: 'Receiving',
    dockClear: (n: number) => `Dock clear: ${n} files labeled and shelved.`,
    bins: {
      'FIN-01': 'Invoices & approvals',
      'SAL-01': 'Price lists',
      'INV-01': 'Stock & SKUs',
      'HR-01': 'Policies',
      'OPS-02': 'Procedures',
      'CUS-02': 'Customer emails',
      'PRJ-02': 'Project notes',
      'LEG-02': 'Contracts',
      'MTG-03': 'Meeting decisions',
      'PUR-03': 'Supplier terms',
      'QA-03': 'Quality checks',
      'TRN-03': 'Training',
    } as Record<string, string>,
    incoming: [
      'pricing_2026_v7_USE-THIS.xlsx',
      'Re: Re: distributor returns',
      'contract_ABC_signed (2).pdf',
      'packing-SOP-old-DONT-USE.docx',
      'chat: who signs POs now?',
      'mon-meeting-notes.txt',
      'new_supplier_checklist.pdf',
    ],
    askTitle: 'Ask the second brain',
    askEmpty: 'Pick a question. The assistant answers only from labeled bins and shows where it looked.',
    sources: 'Sources',
    questions: [
      {
        id: 'q1',
        q: 'Can distributors return unopened stock?',
        a: 'Yes, within 30 days, unopened and with the original delivery note. Orders over 50 units carry a 10% restocking fee.',
        bins: ['LEG-02', 'SAL-01'],
        src: ['LEG-02 · Distributor agreement v4 · §7.2', 'SAL-01 · Price list 2026 · Terms'],
      },
      {
        id: 'q2',
        q: 'Who approves a purchase over $5,000?',
        a: 'The finance manager, then a director if the supplier is new. Raise it on form PO-2 in the ERP.',
        bins: ['FIN-01', 'PUR-03'],
        src: ['FIN-01 · Approval matrix 2026', 'PUR-03 · New supplier checklist'],
      },
      {
        id: 'q3',
        q: 'How do we pack fragile orders?',
        a: 'Double box with 5 cm of fill on every side, a FRAGILE label on two faces, and a photo before sealing.',
        bins: ['OPS-02', 'QA-03'],
        src: ['OPS-02 · Packing procedure rev. 3', 'QA-03 · Damage claims review, March'],
      },
    ] as Question[],
  },
  aisles: {
    title: 'Four aisles. Start in the one that fits.',
    intro:
      'Most companies start with advice and readiness. Some already have tidy data and go straight to a second brain. We will tell you which one you are.',
    get: 'You get',
    items: [
      {
        code: 'ADV',
        title: 'Know where you stand',
        service: 'Advisory',
        text: 'We map how work really moves through your company: the people, the systems, and the spreadsheets nobody admits to. You get a plain-language picture of where AI will pay off now and where it will not yet.',
        get: ['Current-state map', 'Opportunities ranked by effort', 'Step-by-step roadmap'],
      },
      {
        code: 'PRP',
        title: 'Get data and workflows ready',
        service: 'AI readiness',
        text: 'We clean, structure and connect the data AI will rely on, set naming and ownership rules, and write down the procedures that today live only in people’s heads.',
        get: ['Data inventory with owners', 'Cleaned, connected sources', 'Documented workflows', 'Rules for using AI'],
      },
      {
        code: 'KB',
        title: 'One place your company remembers',
        service: 'Second brain',
        text: 'A company knowledge base built from your real documents, decisions and procedures, organized so anyone, and any assistant, finds the current answer and sees where it came from.',
        get: ['Structured knowledge base', 'Answers linked to sources', 'A routine to keep it current'],
      },
      {
        code: 'AGT',
        title: 'An assistant for every role',
        service: 'Agent assistants',
        text: 'Assistants built around specific jobs: answering customers, preparing quotes, onboarding new staff, checking orders. They work from the second brain, inside the tools your team already uses.',
        get: ['Role-specific assistants', 'Review steps and guardrails', 'Hands-on staff training'],
      },
    ] as Aisle[],
  },
  principle: {
    title: 'An assistant is only as good as the shelf it picks from.',
    badTitle: 'Unlabeled warehouse',
    bad: "The assistant guesses. It mixes last year's price list with this year's, quotes a procedure nobody follows, and within a month your staff stop trusting it.",
    goodTitle: 'Labeled warehouse',
    good: 'Every answer comes from the current version, with its source attached. Staff check it in one click, and the assistant gets used every day.',
  },
  method: {
    title: 'How a project runs',
    lede: 'The same four moves a good warehouse makes every day, applied to what your company knows.',
    steps: [
      { name: 'Receiving', does: 'Readiness call and assessment', text: 'We look at your systems, your data and the work that eats the most hours, then agree where to start.' },
      { name: 'Put-away', does: 'Prepare and structure', text: 'Data cleaned, owners named, procedures written down, and knowledge shelved in the second brain.' },
      { name: 'Pick', does: 'Deploy assistants', text: 'One team, one job first. We check it really saves time before it reaches anyone else.' },
      { name: 'Cycle count', does: 'Keep it current', text: 'Regular reviews so the shelves stay labeled as your products, prices and people change.' },
    ],
  },
  readiness: {
    title: 'How ready is your warehouse?',
    intro: 'Eight statements. Tick the ones that are true today. Nothing is sent anywhere; this runs in your browser.',
    legend: 'Readiness statements',
    checks: [
      'Our key procedures are written down where people can find them.',
      'Customer, product and finance data live mainly in one system, not in scattered spreadsheets.',
      'We know who owns each important set of data.',
      'New staff can get answers without interrupting a senior colleague.',
      'Most people follow the same file naming and folder rules.',
      'We can export data from our main systems.',
      'We have rules on what company data may go into AI tools.',
      'We can name two or three tasks that eat hours every week.',
    ],
    zones: [
      { max: 3, zone: 'Receiving dock', advice: 'Start with advice. We map where you stand and what to fix first, before any AI tool is chosen.' },
      { max: 6, zone: 'Half shelved', advice: 'You have a base to build on. Readiness work on data and workflows comes next, then a second brain.' },
      { max: 8, zone: 'Ready to pick', advice: 'Your house is in order. A second brain and a first assistant for one team are a realistic next step.' },
    ],
    cta: 'Talk this through',
  },
  faq: {
    title: 'Questions owners ask us',
    items: [
      { q: 'Do we need to replace our ERP or other systems?', a: 'No. We start from the systems you already run and connect to them. If something genuinely blocks you, we will say so and explain the options, but replacing software is never the starting point.' },
      { q: 'What happens on the readiness call?', a: 'We ask how your company works today: your systems, where data lives, and which tasks take the most time. You leave with an honest view of where to start, even if the answer is that you are not ready yet.' },
      { q: 'What about our data and confidentiality?', a: 'Before anything is connected we agree, in writing, which data may be used, where it is stored, and who can see it. Rules for using AI tools are part of the readiness work, not an afterthought.' },
      { q: 'Which AI tools and models do you use?', a: 'We choose after the assessment, to fit your systems, budget and data rules. The second brain and assistants are designed so you are not locked into one vendor.' },
      { q: 'We are a small company. Is this for us?', a: 'Yes. Small and mid-sized companies often benefit most, because a few people carry most of the knowledge. Getting it written down and findable pays off quickly.' },
      { q: 'Will this replace our staff?', a: 'That is not the goal. Assistants take over searching, copying and first drafts so your people spend their time on customers, judgement and the work only they can do.' },
    ],
  },
  book: {
    title: 'Book a free readiness call',
    lede: 'One conversation about how your company works today. No slides, no tool demo.',
    list: [
      'We ask about your systems, your data and the tasks that eat the most time.',
      'You get an honest view of where AI can help first, and what has to be fixed before it can.',
      'If we are not the right fit, we will say so.',
    ],
    mail: 'Prefer email?',
    name: 'Your name',
    company: 'Company',
    notes: 'What takes up the most time in your company?',
    optional: '(optional)',
    submit: 'Request my call',
  },
  footer: {
    blurb: 'AI readiness, company second brains and agent assistants for small and mid-sized companies.',
    navLabel: 'Footer',
  },
  notFound: {
    title: 'Not on the shelf | ERPTEK',
    code: 'Location not found',
    heading: 'This bin is empty.',
    text: 'The page you were looking for has moved or never existed.',
    back: 'Back to the home page',
  },
};

export type Copy = typeof en;

const vi: Copy = {
  meta: {
    title: 'ERPTEK | Sẵn sàng cho AI, bộ não thứ hai và trợ lý AI cho doanh nghiệp',
    description:
      'ERPTEK chuẩn bị dữ liệu và quy trình cho AI, xây dựng bộ não thứ hai cho doanh nghiệp và trao cho mỗi nhân viên một trợ lý AI làm việc từ đó.',
    ogLocale: 'vi_VN',
  },
  skip: 'Bỏ qua, tới nội dung',
  langSwitch: { label: 'Ngôn ngữ', current: 'Tiếng Việt' },
  nav: {
    label: 'Chính',
    home: 'Trang chủ ERPTEK',
    services: 'Dịch vụ',
    method: 'Phương pháp',
    readiness: 'Kiểm tra mức sẵn sàng',
    faq: 'Hỏi đáp',
    book: 'Đặt lịch',
  },
  form: {
    email: 'Email công việc',
    emailPlaceholder: 'ban@congty.vn',
    size: 'Quy mô công ty',
    choose: 'Chọn',
    sizes: ['1–20 người', '21–100 người', '101–500 người', 'Trên 500 người'],
    honeypot: 'Để trống ô này',
  },
  hero: {
    title: 'Mọi câu trả lời của doanh nghiệp, dán nhãn và xếp đúng kệ.',
    lede: 'ERPTEK chuẩn bị dữ liệu và quy trình của bạn sẵn sàng cho AI, xây dựng bộ não thứ hai cho doanh nghiệp, và trao cho mỗi nhân viên một trợ lý biết tìm, kiểm tra và hành động dựa trên những gì công ty đã biết.',
    stripTitle: 'Tư vấn sẵn sàng AI miễn phí',
    submit: 'Đặt lịch tư vấn',
    rackCaption: 'Tài liệu của bạn, đã xếp kệ và sẵn sàng lấy ra',
    demo: 'Dữ liệu minh họa',
    dockLabel: 'Nhập kho: tài liệu chưa phân loại',
    dockSign: 'Nhập kho',
    dockClear: (n: number) => `Bến đã trống: ${n} tài liệu đã được dán nhãn và xếp kệ.`,
    bins: {
      'FIN-01': 'Hóa đơn & phê duyệt',
      'SAL-01': 'Bảng giá',
      'INV-01': 'Tồn kho & mã hàng',
      'HR-01': 'Chính sách',
      'OPS-02': 'Quy trình',
      'CUS-02': 'Email khách hàng',
      'PRJ-02': 'Ghi chú dự án',
      'LEG-02': 'Hợp đồng',
      'MTG-03': 'Quyết định cuộc họp',
      'PUR-03': 'Điều khoản NCC',
      'QA-03': 'Kiểm tra chất lượng',
      'TRN-03': 'Đào tạo',
    },
    incoming: [
      'bang-gia_2026_v7_DUNG-FILE-NAY.xlsx',
      'Re: Re: đại lý trả hàng',
      'hop-dong_ABC_da-ky (2).pdf',
      'SOP-dong-goi-cu-KHONG-DUNG.docx',
      'Zalo: giờ ai ký PO?',
      'bien-ban-hop-thu-hai.txt',
      'checklist_NCC_moi.pdf',
    ],
    askTitle: 'Hỏi bộ não thứ hai',
    askEmpty: 'Chọn một câu hỏi. Trợ lý chỉ trả lời từ các ngăn đã dán nhãn và cho biết đã tìm ở đâu.',
    sources: 'Nguồn',
    questions: [
      {
        id: 'q1',
        q: 'Đại lý có được trả lại hàng chưa mở không?',
        a: 'Có, trong vòng 30 ngày, hàng còn nguyên và kèm phiếu giao hàng gốc. Đơn trên 50 sản phẩm chịu phí nhập lại kho 10%.',
        bins: ['LEG-02', 'SAL-01'],
        src: ['LEG-02 · Hợp đồng đại lý v4 · §7.2', 'SAL-01 · Bảng giá 2026 · Điều khoản'],
      },
      {
        id: 'q2',
        q: 'Ai duyệt đơn mua hàng trên 100 triệu đồng?',
        a: 'Trưởng phòng tài chính duyệt trước, sau đó cần giám đốc duyệt nếu là nhà cung cấp mới. Tạo phiếu PO-2 trên ERP.',
        bins: ['FIN-01', 'PUR-03'],
        src: ['FIN-01 · Ma trận phê duyệt 2026', 'PUR-03 · Checklist nhà cung cấp mới'],
      },
      {
        id: 'q3',
        q: 'Đóng gói đơn hàng dễ vỡ thế nào?',
        a: 'Hai lớp thùng, chèn lót 5 cm ở mọi mặt, dán nhãn HÀNG DỄ VỠ trên hai mặt và chụp ảnh trước khi niêm phong.',
        bins: ['OPS-02', 'QA-03'],
        src: ['OPS-02 · Quy trình đóng gói bản 3', 'QA-03 · Rà soát khiếu nại hư hỏng, tháng 3'],
      },
    ],
  },
  aisles: {
    title: 'Bốn dãy kệ. Bắt đầu ở dãy phù hợp.',
    intro:
      'Phần lớn doanh nghiệp bắt đầu với tư vấn và chuẩn bị sẵn sàng. Một số đã có dữ liệu gọn gàng và đi thẳng tới bộ não thứ hai. Chúng tôi sẽ cho bạn biết bạn thuộc nhóm nào.',
    get: 'Bạn nhận được',
    items: [
      {
        code: 'ADV',
        title: 'Biết mình đang ở đâu',
        service: 'Tư vấn',
        text: 'Chúng tôi vẽ lại cách công việc thực sự vận hành trong công ty bạn: con người, hệ thống, và cả những file Excel không ai muốn nhắc tới. Bạn nhận được một bức tranh dễ hiểu về chỗ AI mang lại hiệu quả ngay và chỗ chưa nên làm.',
        get: ['Bản đồ hiện trạng', 'Cơ hội xếp theo mức công sức', 'Lộ trình từng bước'],
      },
      {
        code: 'PRP',
        title: 'Chuẩn bị dữ liệu và quy trình',
        service: 'Sẵn sàng cho AI',
        text: 'Chúng tôi làm sạch, cấu trúc và kết nối dữ liệu mà AI sẽ dựa vào, đặt quy tắc đặt tên và người phụ trách, và viết ra những quy trình hiện chỉ nằm trong đầu một vài người.',
        get: ['Danh mục dữ liệu kèm người phụ trách', 'Nguồn dữ liệu sạch, đã kết nối', 'Quy trình được văn bản hóa', 'Quy tắc sử dụng AI'],
      },
      {
        code: 'KB',
        title: 'Một nơi doanh nghiệp ghi nhớ',
        service: 'Bộ não thứ hai',
        text: 'Kho tri thức doanh nghiệp xây từ chính tài liệu, quyết định và quy trình của bạn, được sắp xếp để bất kỳ ai, và bất kỳ trợ lý nào, cũng tìm được câu trả lời mới nhất và biết nó đến từ đâu.',
        get: ['Kho tri thức có cấu trúc', 'Câu trả lời kèm nguồn', 'Quy trình cập nhật định kỳ'],
      },
      {
        code: 'AGT',
        title: 'Một trợ lý cho mỗi vị trí',
        service: 'Trợ lý AI',
        text: 'Trợ lý được xây quanh từng công việc cụ thể: trả lời khách hàng, lập báo giá, hướng dẫn nhân viên mới, kiểm tra đơn hàng. Chúng làm việc từ bộ não thứ hai, ngay trong các công cụ đội ngũ của bạn đang dùng.',
        get: ['Trợ lý theo từng vị trí', 'Bước kiểm duyệt và giới hạn an toàn', 'Đào tạo nhân viên thực hành'],
      },
    ],
  },
  principle: {
    title: 'Trợ lý chỉ tốt bằng chính kệ hàng nó lấy ra.',
    badTitle: 'Kho chưa dán nhãn',
    bad: 'Trợ lý đoán mò. Nó trộn bảng giá năm ngoái với năm nay, trích một quy trình không ai còn làm, và chỉ sau một tháng nhân viên thôi tin nó.',
    goodTitle: 'Kho đã dán nhãn',
    good: 'Mỗi câu trả lời lấy từ phiên bản mới nhất, kèm nguồn. Nhân viên kiểm tra chỉ bằng một cú nhấp, và trợ lý được dùng mỗi ngày.',
  },
  method: {
    title: 'Một dự án diễn ra thế nào',
    lede: 'Bốn bước mà một nhà kho tốt làm mỗi ngày, áp dụng cho tri thức của doanh nghiệp bạn.',
    steps: [
      { name: 'Nhập kho', does: 'Tư vấn và đánh giá mức sẵn sàng', text: 'Chúng tôi xem hệ thống, dữ liệu và những việc tốn nhiều giờ nhất, rồi cùng thống nhất điểm bắt đầu.' },
      { name: 'Xếp kệ', does: 'Chuẩn bị và cấu trúc', text: 'Dữ liệu được làm sạch, có người phụ trách, quy trình được viết ra, tri thức được xếp vào bộ não thứ hai.' },
      { name: 'Lấy hàng', does: 'Triển khai trợ lý', text: 'Bắt đầu với một nhóm, một việc. Chúng tôi kiểm chứng nó thực sự tiết kiệm thời gian trước khi mở rộng.' },
      { name: 'Kiểm kê', does: 'Luôn cập nhật', text: 'Rà soát định kỳ để kệ luôn đúng nhãn khi sản phẩm, giá và con người thay đổi.' },
    ],
  },
  readiness: {
    title: 'Nhà kho của bạn sẵn sàng tới đâu?',
    intro: 'Tám nhận định. Đánh dấu những điều đúng với công ty bạn hôm nay. Không có gì được gửi đi; mọi thứ chạy ngay trên trình duyệt của bạn.',
    legend: 'Các nhận định về mức sẵn sàng',
    checks: [
      'Các quy trình quan trọng đã được viết ra ở nơi mọi người tìm được.',
      'Dữ liệu khách hàng, sản phẩm và tài chính chủ yếu nằm trong một hệ thống, không rải rác trong các file Excel.',
      'Chúng tôi biết ai phụ trách từng bộ dữ liệu quan trọng.',
      'Nhân viên mới tìm được câu trả lời mà không phải làm phiền đồng nghiệp lâu năm.',
      'Hầu hết mọi người theo cùng một quy tắc đặt tên file và thư mục.',
      'Chúng tôi có thể xuất dữ liệu từ các hệ thống chính.',
      'Chúng tôi có quy định về dữ liệu nào được phép đưa vào công cụ AI.',
      'Chúng tôi kể tên được hai, ba việc ngốn nhiều giờ mỗi tuần.',
    ],
    zones: [
      { max: 3, zone: 'Bến nhập kho', advice: 'Hãy bắt đầu với tư vấn. Chúng tôi xác định bạn đang ở đâu và cần sửa gì trước, trước khi chọn bất kỳ công cụ AI nào.' },
      { max: 6, zone: 'Đã xếp một nửa', advice: 'Bạn đã có nền tảng. Bước tiếp theo là chuẩn bị dữ liệu và quy trình, rồi đến bộ não thứ hai.' },
      { max: 8, zone: 'Sẵn sàng lấy hàng', advice: 'Nhà kho đã ngăn nắp. Bộ não thứ hai và một trợ lý đầu tiên cho một nhóm là bước tiếp theo khả thi.' },
    ],
    cta: 'Trao đổi kết quả này',
  },
  faq: {
    title: 'Câu hỏi chủ doanh nghiệp thường hỏi',
    items: [
      { q: 'Chúng tôi có cần thay ERP hay các hệ thống khác không?', a: 'Không. Chúng tôi bắt đầu từ những hệ thống bạn đang dùng và kết nối với chúng. Nếu có hệ thống thực sự cản trở, chúng tôi sẽ nói rõ và giải thích các lựa chọn, nhưng thay phần mềm không bao giờ là điểm khởi đầu.' },
      { q: 'Buổi tư vấn mức sẵn sàng diễn ra thế nào?', a: 'Chúng tôi hỏi công ty bạn đang vận hành ra sao: hệ thống, dữ liệu nằm ở đâu, và việc gì tốn nhiều thời gian nhất. Bạn ra về với cái nhìn trung thực về nên bắt đầu từ đâu, kể cả khi câu trả lời là bạn chưa sẵn sàng.' },
      { q: 'Còn dữ liệu và tính bảo mật thì sao?', a: 'Trước khi kết nối bất cứ thứ gì, chúng tôi thống nhất bằng văn bản dữ liệu nào được dùng, lưu ở đâu và ai được xem. Quy tắc sử dụng công cụ AI là một phần của công việc chuẩn bị, không phải việc tính sau.' },
      { q: 'Các bạn dùng công cụ và mô hình AI nào?', a: 'Chúng tôi chọn sau khi đánh giá, sao cho phù hợp với hệ thống, ngân sách và quy định dữ liệu của bạn. Bộ não thứ hai và các trợ lý được thiết kế để bạn không bị phụ thuộc vào một nhà cung cấp.' },
      { q: 'Công ty chúng tôi nhỏ. Dịch vụ này có phù hợp không?', a: 'Có. Doanh nghiệp nhỏ và vừa thường hưởng lợi nhiều nhất, vì tri thức thường tập trung ở vài người. Viết lại và giúp mọi người tìm được tri thức đó mang lại hiệu quả rất nhanh.' },
      { q: 'Việc này có thay thế nhân viên của chúng tôi không?', a: 'Đó không phải mục tiêu. Trợ lý đảm nhận việc tìm kiếm, sao chép và soạn bản nháp đầu tiên để nhân viên dành thời gian cho khách hàng, cho những quyết định cần kinh nghiệm và những việc chỉ họ làm được.' },
    ],
  },
  book: {
    title: 'Đặt lịch tư vấn mức sẵn sàng miễn phí',
    lede: 'Một buổi trao đổi về cách công ty bạn đang vận hành. Không slide, không demo công cụ.',
    list: [
      'Chúng tôi hỏi về hệ thống, dữ liệu và những việc tốn nhiều thời gian nhất.',
      'Bạn nhận được cái nhìn trung thực về chỗ AI có thể giúp trước, và những gì cần sửa để AI phát huy.',
      'Nếu chúng tôi không phù hợp, chúng tôi sẽ nói thẳng.',
    ],
    mail: 'Muốn trao đổi qua email?',
    name: 'Họ và tên',
    company: 'Công ty',
    notes: 'Việc gì đang tốn nhiều thời gian nhất ở công ty bạn?',
    optional: '(không bắt buộc)',
    submit: 'Gửi yêu cầu',
  },
  footer: {
    blurb: 'Sẵn sàng cho AI, bộ não thứ hai cho doanh nghiệp và trợ lý AI cho doanh nghiệp nhỏ và vừa.',
    navLabel: 'Chân trang',
  },
  notFound: {
    title: 'Không có trên kệ | ERPTEK',
    code: 'Không tìm thấy vị trí',
    heading: 'Ngăn này trống.',
    text: 'Trang bạn tìm đã được chuyển đi hoặc không tồn tại.',
    back: 'Về trang chủ',
  },
};

export const copy: Record<Lang, Copy> = { en, vi };

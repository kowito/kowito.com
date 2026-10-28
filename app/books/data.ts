export type Shelf =
  | "Life & Mind"
  | "Business & Work"
  | "Economics & Behavior"
  | "Money & Markets"
  | "History & Fiction";

export type Store = "Naiin" | "Chulabook" | "WeLearn" | "Amarin Books";

export interface Book {
  id: number;
  title: string;
  /** Title of the Thai edition, when the book has an English or original-language title too. */
  thaiTitle?: string;
  author: string;
  genre: string;
  shelf: Shelf;
  /** Product page for this edition. Left out when no listing could be verified. */
  link?: { store: Store; url: string };
  /** Cover image under /public/covers, when we have one. */
  cover?: string;
}

// Ordered left to right, as the books sit on the shelf.
export const books: Book[] = [
  {
    id: 1,
    title: "Atomic Habits",
    thaiTitle: "เพราะชีวิตดีได้กว่าที่เป็น",
    author: "James Clear",
    genre: "Self-Improvement / Psychology",
    shelf: "Life & Mind",
    link: { store: "Chulabook", url: "https://www.chulabook.com/psychology-development/105286" },
    cover: "/covers/01.jpg",
  },
  {
    id: 2,
    title: "Economics 101",
    thaiTitle: "เศรษฐศาสตร์ 101",
    author: "Alfred Mill",
    genre: "Economics",
    shelf: "Economics & Behavior",
    link: { store: "Chulabook", url: "https://www.chulabook.com/business-economics/186835" },
    cover: "/covers/02.jpg",
  },
  {
    id: 3,
    title: "The Hard Thing About Hard Things",
    thaiTitle: "เมื่อไม่มีเส้นทางที่ง่ายในการทำธุรกิจ",
    author: "Ben Horowitz",
    genre: "Business / Startups",
    shelf: "Business & Work",
    link: {
      store: "WeLearn",
      url: "https://www.welearnbook.com/product/31493-25136/%E0%B9%80%E0%B8%A1%E0%B8%B7%E0%B9%88%E0%B8%AD%E0%B9%84%E0%B8%A1%E0%B9%88%E0%B8%A1%E0%B8%B5%E0%B9%80%E0%B8%AA%E0%B9%89%E0%B8%99%E0%B8%97%E0%B8%B2%E0%B8%87%E0%B8%97%E0%B8%B5%E0%B9%88%E0%B8%87%E0%B9%88%E0%B8%B2%E0%B8%A2%E0%B9%83%E0%B8%99%E0%B8%81%E0%B8%B2%E0%B8%A3%E0%B8%97%E0%B8%B3%E0%B8%98%E0%B8%B8%E0%B8%A3%E0%B8%81%E0%B8%B4%E0%B8%88-the-hard-thing-about-hard-things",
    },
    cover: "/covers/03.jpg",
  },
  {
    id: 4,
    title: "Start with Why",
    thaiTitle: "ทำไมต้องเริ่มด้วย \"ทำไม\"",
    author: "Simon Sinek",
    genre: "Business Management / Leadership",
    shelf: "Business & Work",
    link: { store: "Chulabook", url: "https://www.chulabook.com/psychology-development/160114" },
    cover: "/covers/04.jpg",
  },
  {
    id: 5,
    title: "Sapiens: A Brief History of Humankind",
    thaiTitle: "เซเปียนส์ ประวัติย่อมนุษยชาติ",
    author: "Yuval Noah Harari",
    genre: "History / Anthropology",
    shelf: "History & Fiction",
    link: { store: "Chulabook", url: "https://www.chulabook.com/history-religion-culture-politics-government/147171" },
    cover: "/covers/05.jpg",
  },
  {
    id: 6,
    title: "Think Again",
    thaiTitle: "คิดแล้ว, คิดอีก",
    author: "Adam Grant",
    genre: "Psychology / Self-Improvement",
    shelf: "Life & Mind",
    link: { store: "Chulabook", url: "https://www.chulabook.com/psychology-development/146542" },
    cover: "/covers/06.jpg",
  },
  {
    id: 7,
    title: "The Asshole Survival Guide",
    thaiTitle: "ศิลปะการอยู่ร่วมกับคนเฮงซวย",
    author: "Robert I. Sutton",
    genre: "Psychology / Self-Improvement",
    shelf: "Life & Mind",
    link: {
      store: "Amarin Books",
      url: "https://amarinbooks.com/product/%e0%b8%a8%e0%b8%b4%e0%b8%a5%e0%b8%9b%e0%b8%b0%e0%b8%81%e0%b8%b2%e0%b8%a3%e0%b8%ad%e0%b8%a2%e0%b8%b9%e0%b9%88%e0%b8%a3%e0%b9%88%e0%b8%a7%e0%b8%a1%e0%b8%81%e0%b8%b1%e0%b8%9a%e0%b8%84%e0%b8%99%e0%b9%80/",
    },
    cover: "/covers/07.jpg",
  },
  {
    id: 8,
    title: "Drive: The Surprising Truth About What Motivates Us",
    thaiTitle: "เมื่อสิ่งที่จูงใจคนได้...ไม่ใช่อย่างที่คุณคิด",
    author: "Daniel H. Pink",
    genre: "Psychology / Productivity",
    shelf: "Life & Mind",
    link: {
      store: "WeLearn",
      url: "https://www.welearnbook.com/product/27782-21719/%E0%B9%80%E0%B8%A1%E0%B8%B7%E0%B9%88%E0%B8%AD%E0%B8%AA%E0%B8%B4%E0%B9%88%E0%B8%87%E0%B8%97%E0%B8%B5%E0%B9%88%E0%B8%88%E0%B8%B9%E0%B8%87%E0%B9%83%E0%B8%88%E0%B8%84%E0%B8%99%E0%B9%84%E0%B8%94%E0%B9%89%E0%B9%84%E0%B8%A1%E0%B9%88%E0%B9%83%E0%B8%8A%E0%B9%88%E0%B8%AD%E0%B8%A2%E0%B9%88%E0%B8%B2%E0%B8%87%E0%B8%97%E0%B8%B5%E0%B9%88%E0%B8%84%E0%B8%B8%E0%B8%93%E0%B8%84%E0%B8%B4%E0%B8%94-drive",
    },
    cover: "/covers/08.jpg",
  },
  {
    id: 9,
    title: "The Psychology of Money",
    thaiTitle: "จิตวิทยาว่าด้วยเงิน",
    author: "Morgan Housel",
    genre: "Personal Finance / Investing",
    shelf: "Money & Markets",
    link: { store: "Chulabook", url: "https://www.chulabook.com/business-economics/147976" },
    cover: "/covers/09.jpg",
  },
  {
    id: 10,
    title: "The Four: The Hidden DNA of Amazon, Apple, Facebook, and Google",
    thaiTitle: "เปิดโปงด้านสีเทาของ 4 พ่อมดไอที",
    author: "Scott Galloway",
    genre: "Business / Tech Strategy",
    shelf: "Business & Work",
    link: { store: "Naiin", url: "https://www.naiin.com/product/detail/239073" },
    cover: "/covers/10.jpg",
  },
  {
    id: 11,
    title: "Rework",
    thaiTitle: "จงทิ้งทุกอย่างที่คุณเคยรู้ ก่อนเริ่มทำธุรกิจ",
    author: "Jason Fried & David Heinemeier Hansson",
    genre: "Business / Entrepreneurship",
    shelf: "Business & Work",
    link: { store: "Chulabook", url: "https://www.chulabook.com/business-economics/14912" },
    cover: "/covers/11.jpg",
  },
  {
    id: 12,
    title: "Nudge: Improving Decisions About Health, Wealth, and Happiness",
    thaiTitle: "สะกดความคิด สะกิดพฤติกรรม",
    author: "Richard H. Thaler & Cass R. Sunstein",
    genre: "Behavioral Economics",
    shelf: "Economics & Behavior",
    link: { store: "Chulabook", url: "https://www.chulabook.com/psychology-development/14957" },
  },
  {
    id: 13,
    title: "Delivering Happiness",
    thaiTitle: "ใช้ความสุขทำกำไร",
    author: "Tony Hsieh",
    genre: "Business / Customer Service",
    shelf: "Business & Work",
    link: { store: "Chulabook", url: "https://www.chulabook.com/business-economics/159256" },
    cover: "/covers/13.jpg",
  },
  {
    id: 14,
    title: "This Is Marketing",
    thaiTitle: "สร้างแบรนด์ให้ยิ่งใหญ่ ไม่จำเป็นต้องเอาใจทุกคน",
    author: "Seth Godin",
    genre: "Marketing / Business",
    shelf: "Business & Work",
    link: { store: "Chulabook", url: "https://www.chulabook.com/business-economics/10824" },
    cover: "/covers/14.jpg",
  },
  {
    id: 15,
    title: "The Subtle Art of Not Giving a F*ck",
    thaiTitle: "ชีวิตติดปีก ด้วยศิลปะแห่งการ \"ช่างแม่ง\"",
    author: "Mark Manson",
    genre: "Psychology / Self-Improvement",
    shelf: "Life & Mind",
    link: { store: "Chulabook", url: "https://www.chulabook.com/psychology-development/105215" },
    cover: "/covers/15.jpg",
  },
  {
    // Unverified: no store or publisher lists this title or author.
    id: 16,
    title: "51 วิธีคิดของคนที่ทำอะไรก็สำเร็จไว",
    author: "Shivasaki Yukio",
    genre: "Productivity / Self-Improvement",
    shelf: "Life & Mind",
  },
  {
    id: 17,
    title: "เข้าใจให้ลึกซึ้ง 3 เครื่องมือหลัก แท่งเทียน แนวรับ - แนวต้าน เส้นแนวโน้ม",
    author: "Daddy Trader",
    genre: "Stock Technical Analysis",
    shelf: "Money & Markets",
    link: { store: "Chulabook", url: "https://www.chulabook.com/business-economics/110913" },
    cover: "/covers/17.jpg",
  },
  {
    id: 18,
    title: "เข้าใจให้ลึกซึ้ง 3 อินดิเคเตอร์หลัก EMA MACD RSI",
    author: "Daddy Trader",
    genre: "Stock Technical Analysis",
    shelf: "Money & Markets",
    link: { store: "Chulabook", url: "https://www.chulabook.com/business-economics/73185" },
    cover: "/covers/18.jpg",
  },
  {
    id: 19,
    title: "Irrationally Yours",
    thaiTitle: "เศรษฐศาสตร์พฤติกรรมช่วยชีวิตฉันจากป้าข้างบ้าน",
    author: "Dan Ariely",
    genre: "Behavioral Economics / Psychology",
    shelf: "Economics & Behavior",
    link: {
      store: "WeLearn",
      url: "https://www.welearnbook.com/product/44933-40461/%E0%B9%80%E0%B8%A8%E0%B8%A3%E0%B8%A9%E0%B8%90%E0%B8%A8%E0%B8%B2%E0%B8%AA%E0%B8%95%E0%B8%A3%E0%B9%8C%E0%B8%9E%E0%B8%A4%E0%B8%95%E0%B8%B4%E0%B8%81%E0%B8%A3%E0%B8%A3%E0%B8%A1%E0%B8%8A%E0%B9%88%E0%B8%A7%E0%B8%A2%E0%B8%8A%E0%B8%B5%E0%B8%A7%E0%B8%B4%E0%B8%95%E0%B8%89%E0%B8%B1%E0%B8%99%E0%B8%88%E0%B8%B2%E0%B8%81%E0%B8%9B%E0%B9%89%E0%B8%B2%E0%B8%82%E0%B9%89%E0%B8%B2%E0%B8%87%E0%B8%9A%E0%B9%89%E0%B8%B2%E0%B8%99-irrationally-yours",
    },
    cover: "/covers/19.jpg",
  },
  {
    id: 20,
    title: "The Worst-Case Scenario Survival Handbook",
    thaiTitle: "คู่มือเอาตัวรอดจากสถานการณ์ฉิบหายขั้นสุด",
    author: "Joshua Piven & David Borgenicht",
    genre: "Survival Guide / Non-Fiction",
    shelf: "Life & Mind",
    link: {
      store: "WeLearn",
      url: "https://www.welearnbook.com/product/44661-40142/%E0%B8%84%E0%B8%B9%E0%B9%88%E0%B8%A1%E0%B8%B7%E0%B8%AD%E0%B9%80%E0%B8%AD%E0%B8%B2%E0%B8%95%E0%B8%B1%E0%B8%A7%E0%B8%A3%E0%B8%AD%E0%B8%94%E0%B8%88%E0%B8%B2%E0%B8%81%E0%B8%AA%E0%B8%96%E0%B8%B2%E0%B8%99%E0%B8%81%E0%B8%B2%E0%B8%A3%E0%B8%93%E0%B9%8C%E0%B8%89%E0%B8%B4%E0%B8%9A%E0%B8%AB%E0%B8%B2%E0%B8%A2%E0%B8%82%E0%B8%B1%E0%B9%89%E0%B8%99%E0%B8%AA%E0%B8%B8%E0%B8%94-the-worst-case-scenario-survival-handbook-",
    },
    cover: "/covers/20.jpg",
  },
  {
    // Unverified: no such boxed set turned up; only คำพิพากษา (Chart Korbjitti) is a confirmed book.
    id: 21,
    title: "ชุดวรรณกรรมยอดเยี่ยม (ชาลี • กองทัพกวาง • คำพิพากษา)",
    author: "Chalee / Wanich / Chart Korbjitti",
    genre: "Thai Classic Literature",
    shelf: "History & Fiction",
  },
  {
    // Several Thai translations exist; this listing matches the table's title, not necessarily the copy on the shelf.
    id: 22,
    title: "Animal Farm",
    thaiTitle: "แอนิมอล ฟาร์ม",
    author: "George Orwell",
    genre: "Political Satire / Fiction",
    shelf: "History & Fiction",
    link: { store: "Naiin", url: "https://www.naiin.com/product/detail/214819" },
  },
  {
    id: 23,
    title: "Predictably Irrational",
    thaiTitle: "พฤติกรรมพยากรณ์",
    author: "Dan Ariely",
    genre: "Behavioral Economics",
    shelf: "Economics & Behavior",
    link: { store: "Chulabook", url: "https://www.chulabook.com/psychology-development/171032" },
    cover: "/covers/23.jpg",
  },
  {
    id: 24,
    title: "Remote: Office Not Required",
    thaiTitle: "สร้างธุรกิจให้ได้ดี ไม่ต้องมีออฟฟิศ",
    author: "Jason Fried & David Heinemeier Hansson",
    genre: "Business / Remote Work",
    shelf: "Business & Work",
    link: {
      store: "WeLearn",
      url: "https://www.welearnbook.com/product/17698-14587/%E0%B8%AA%E0%B8%A3%E0%B9%89%E0%B8%B2%E0%B8%87%E0%B8%98%E0%B8%B8%E0%B8%A3%E0%B8%81%E0%B8%B4%E0%B8%88%E0%B9%83%E0%B8%AB%E0%B9%89%E0%B9%84%E0%B8%94%E0%B9%89%E0%B8%94%E0%B8%B5%E0%B9%84%E0%B8%A1%E0%B9%88%E0%B8%95%E0%B9%89%E0%B8%AD%E0%B8%87%E0%B8%A1%E0%B8%B5%E0%B8%AD%E0%B8%AD%E0%B8%9F%E0%B8%9F%E0%B8%B4%E0%B8%A8-remote",
    },
    cover: "/covers/24.jpg",
  },
  {
    id: 25,
    title: "Four Thousand Weeks: Time Management for Mortals",
    thaiTitle: "ชีวิตเรามีแค่สี่พันสัปดาห์",
    author: "Oliver Burkeman",
    genre: "Time Management / Self-Improvement",
    shelf: "Life & Mind",
    link: { store: "Chulabook", url: "https://www.chulabook.com/en/psychology-development/166687" },
    cover: "/covers/25.jpg",
  },
  {
    // Unverified: no store or publisher lists this title or author.
    id: 26,
    title: "ความสำเร็จรอยกเว้นคนขี้เกียจ (เศรษฐศาสตร์พฤติกรรมฉบับใช้งาน)",
    author: "Kazuhisa Chintani",
    genre: "Behavioral Economics",
    shelf: "Economics & Behavior",
  },
  {
    id: 27,
    title: "Company of One",
    thaiTitle: "บริษัทตัวคนเดียว",
    author: "Paul Jarvis",
    genre: "Business / Entrepreneurship",
    shelf: "Business & Work",
    link: { store: "Naiin", url: "https://www.naiin.com/product/detail/600065" },
    cover: "/covers/27.jpg",
  },
  {
    id: 28,
    title: "Principles: Life and Work",
    author: "Ray Dalio",
    genre: "Business Management / Investing",
    shelf: "Business & Work",
    link: { store: "Chulabook", url: "https://www.chulabook.com/business-economics/24930" },
    cover: "/covers/28.jpg",
  },
  {
    id: 29,
    title: "Pour la plus grande gloire de Dieu",
    thaiTitle: "รุกสยาม ในพระนามของพระเจ้า",
    author: "Morgan Sportès",
    genre: "History / Historical Fiction",
    shelf: "History & Fiction",
    link: { store: "Chulabook", url: "https://www.chulabook.com/literature/224784" },
    cover: "/covers/29.jpg",
  },
  {
    // Part 1 of the Butterfly (ผีเสื้อ) translation; Part 2 is a separate volume.
    id: 30,
    title: "Don Quixote de la Mancha",
    thaiTitle: "ดอนกิโฆเต้ แห่งลามันซ่า",
    author: "Miguel de Cervantes Saavedra",
    genre: "Classic Literature",
    shelf: "History & Fiction",
    link: { store: "Naiin", url: "https://www.naiin.com/product/detail/65304" },
  },
];

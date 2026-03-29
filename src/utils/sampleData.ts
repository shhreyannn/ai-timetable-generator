import { InputData, Subject, Teacher, Room, Timeslot, ClassGroup } from './types';

const SUBJECT_COLORS = [
  '#6366f1', '#8b5cf6', '#ec4899', '#f59e0b',
  '#10b981', '#3b82f6', '#ef4444', '#14b8a6',
];

export function getSampleData(): InputData {

  // ── B.Tech CSE Subjects (2 hrs/week each) ─────────────────────────────
  const subjects: Subject[] = [
    { id: 'sub1', name: 'Data Structures & Algorithms', color: SUBJECT_COLORS[0], hoursPerWeek: 2 },
    { id: 'sub2', name: 'Database Management Systems',  color: SUBJECT_COLORS[1], hoursPerWeek: 2 },
    { id: 'sub3', name: 'Operating Systems',            color: SUBJECT_COLORS[2], hoursPerWeek: 2 },
    { id: 'sub4', name: 'Computer Networks',            color: SUBJECT_COLORS[3], hoursPerWeek: 2 },
    { id: 'sub5', name: 'Object Oriented Programming',  color: SUBJECT_COLORS[4], hoursPerWeek: 2 },
    { id: 'sub6', name: 'Discrete Mathematics',         color: SUBJECT_COLORS[5], hoursPerWeek: 2 },
    { id: 'sub7', name: 'Theory of Computation',        color: SUBJECT_COLORS[6], hoursPerWeek: 2 },
    { id: 'sub8', name: 'Software Engineering',         color: SUBJECT_COLORS[7], hoursPerWeek: 2 },
  ];

  // ── 60 Indian Faculty (7–8 per subject) ───────────────────────────────
  const teachers: Teacher[] = [
    { id: 'tch1',  name: 'Dr. Raghavendra Sharma',     subjects: ['sub1'] },
    { id: 'tch2',  name: 'Dr. Ananya Krishnamurthy',   subjects: ['sub1'] },
    { id: 'tch3',  name: 'Prof. Suresh Babu',          subjects: ['sub1'] },
    { id: 'tch4',  name: 'Mr. Vikram Singh',           subjects: ['sub1'] },
    { id: 'tch5',  name: 'Dr. Pooja Deshmukh',         subjects: ['sub1'] },
    { id: 'tch6',  name: 'Prof. Aakash Dutta',         subjects: ['sub1'] },
    { id: 'tch7',  name: 'Ms. Nandini Pillai',         subjects: ['sub1'] },
    { id: 'tch8',  name: 'Dr. Hemant Jha',             subjects: ['sub1'] },

    { id: 'tch9',  name: 'Prof. Priya Nair',           subjects: ['sub2'] },
    { id: 'tch10', name: 'Dr. Sanjay Patel',           subjects: ['sub2'] },
    { id: 'tch11', name: 'Ms. Kavitha Reddy',          subjects: ['sub2'] },
    { id: 'tch12', name: 'Dr. Ramesh Babu Yadav',      subjects: ['sub2'] },
    { id: 'tch13', name: 'Prof. Sunita Agarwal',       subjects: ['sub2'] },
    { id: 'tch14', name: 'Dr. Mohan Das',              subjects: ['sub2'] },
    { id: 'tch15', name: 'Ms. Rekha Menon',            subjects: ['sub2'] },
    { id: 'tch16', name: 'Prof. Tarun Kapoor',         subjects: ['sub2'] },

    { id: 'tch17', name: 'Dr. Anil Kumar Verma',       subjects: ['sub3'] },
    { id: 'tch18', name: 'Prof. Meenakshi Iyer',       subjects: ['sub3'] },
    { id: 'tch19', name: 'Dr. Girish Narayan',         subjects: ['sub3'] },
    { id: 'tch20', name: 'Mr. Ajay Tiwari',            subjects: ['sub3'] },
    { id: 'tch21', name: 'Dr. Bhavana Kulkarni',       subjects: ['sub3'] },
    { id: 'tch22', name: 'Prof. Nitin Saxena',         subjects: ['sub3'] },
    { id: 'tch23', name: 'Ms. Swati Banerjee',         subjects: ['sub3'] },
    { id: 'tch24', name: 'Dr. Prakash Hegde',          subjects: ['sub3'] },

    { id: 'tch25', name: 'Dr. Deepa Venkataraman',     subjects: ['sub4'] },
    { id: 'tch26', name: 'Mr. Harish Chandra Mishra',  subjects: ['sub4'] },
    { id: 'tch27', name: 'Prof. Nalini Subramaniam',   subjects: ['sub4'] },
    { id: 'tch28', name: 'Dr. Santosh Rathore',        subjects: ['sub4'] },
    { id: 'tch29', name: 'Ms. Aarti Choudhury',        subjects: ['sub4'] },
    { id: 'tch30', name: 'Dr. Rohit Bhaskar',          subjects: ['sub4'] },
    { id: 'tch31', name: 'Prof. Uma Shankar',          subjects: ['sub4'] },
    { id: 'tch32', name: 'Mr. Karthik Raghavan',       subjects: ['sub4'] },

    { id: 'tch33', name: 'Dr. Rajesh Gupta',           subjects: ['sub5'] },
    { id: 'tch34', name: 'Ms. Shweta Joshi',           subjects: ['sub5'] },
    { id: 'tch35', name: 'Prof. Manoj Tripathi',       subjects: ['sub5'] },
    { id: 'tch36', name: 'Dr. Preeti Bhatia',          subjects: ['sub5'] },
    { id: 'tch37', name: 'Mr. Arjun Nambiar',          subjects: ['sub5'] },
    { id: 'tch38', name: 'Dr. Sapna Khanna',           subjects: ['sub5'] },
    { id: 'tch39', name: 'Prof. Gaurav Sinha',         subjects: ['sub5'] },

    { id: 'tch40', name: 'Prof. Lakshmi Chandrasekhar', subjects: ['sub6'] },
    { id: 'tch41', name: 'Dr. Venkateswara Rao',       subjects: ['sub6'] },
    { id: 'tch42', name: 'Ms. Ritu Saxena',            subjects: ['sub6'] },
    { id: 'tch43', name: 'Dr. Kiran Lata',             subjects: ['sub6'] },
    { id: 'tch44', name: 'Prof. Arun Mehta',           subjects: ['sub6'] },
    { id: 'tch45', name: 'Dr. Neelam Sharma',          subjects: ['sub6'] },
    { id: 'tch46', name: 'Mr. Dinesh Prasad',          subjects: ['sub6'] },

    { id: 'tch47', name: 'Dr. Amarendra Pandey',       subjects: ['sub7'] },
    { id: 'tch48', name: 'Prof. Geeta Krishnaswamy',   subjects: ['sub7'] },
    { id: 'tch49', name: 'Dr. Naresh Malhotra',        subjects: ['sub7'] },
    { id: 'tch50', name: 'Ms. Sneha Rao',              subjects: ['sub7'] },
    { id: 'tch51', name: 'Dr. Vivek Chauhan',          subjects: ['sub7'] },
    { id: 'tch52', name: 'Prof. Indira Mishra',        subjects: ['sub7'] },
    { id: 'tch53', name: 'Mr. Siddharth Nair',         subjects: ['sub7'] },

    { id: 'tch54', name: 'Prof. Divya Menon',          subjects: ['sub8'] },
    { id: 'tch55', name: 'Dr. Sunil Khandelwal',       subjects: ['sub8'] },
    { id: 'tch56', name: 'Mr. Rohit Chaudhary',        subjects: ['sub8'] },
    { id: 'tch57', name: 'Dr. Padmavathi Seshadri',    subjects: ['sub8'] },
    { id: 'tch58', name: 'Prof. Kishore Reddy',        subjects: ['sub8'] },
    { id: 'tch59', name: 'Ms. Pallavi Jain',           subjects: ['sub8'] },
    { id: 'tch60', name: 'Dr. Ashok Verma',            subjects: ['sub8'] },
  ];

  // ── 15 Rooms (capacity 60 each) ──────────────────────────────────────
  // One room per letter. A1 uses it morning, A2 uses it afternoon.
  const letters = ['A','B','C','D','E','F','G','H','I','J','K','L','M','N','O'];
  const rooms: Room[] = letters.map(letter => ({
    id: `room_${letter}`,
    name: `Room-${letter}`,
    capacity: 60,
  }));

  // ── Timeslots: 50 min classes, 5 min breaks ──────────────────────────
  //
  // MORNING SHIFT (Section 1: A1–O1)
  //   P1: 08:00–08:50  │  P2: 08:55–09:45  │  P3: 09:50–10:40
  //   P4: 10:45–11:35  │  P5: 11:40–12:25
  //
  // AFTERNOON SHIFT (Section 2: A2–O2)
  //   P6: 12:30–01:20  │  P7: 01:25–02:15  │  P8: 02:20–03:10
  //   P9: 03:15–04:05  │  P10: 04:10–05:00

  const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'];

  const morningSlots = [
    { period: 1,  label: '08:00–08:50' },
    { period: 2,  label: '08:55–09:45' },
    { period: 3,  label: '09:50–10:40' },
    { period: 4,  label: '10:45–11:35' },
    { period: 5,  label: '11:40–12:25' },
  ];
  const afternoonSlots = [
    { period: 6,  label: '12:30–01:20' },
    { period: 7,  label: '01:25–02:15' },
    { period: 8,  label: '02:20–03:10' },
    { period: 9,  label: '03:15–04:05' },
    { period: 10, label: '04:10–05:00' },
  ];

  const timeslots: Timeslot[] = [];
  const morningIds: string[] = [];
  const afternoonIds: string[] = [];

  for (const day of days) {
    const pre = day.toLowerCase().slice(0, 3);
    for (const { period, label } of morningSlots) {
      const id = `${pre}_p${period}`;
      timeslots.push({ id, day, period, label, shift: 'morning' });
      morningIds.push(id);
    }
    for (const { period, label } of afternoonSlots) {
      const id = `${pre}_p${period}`;
      timeslots.push({ id, day, period, label, shift: 'afternoon' });
      afternoonIds.push(id);
    }
  }

  // ── 30 Classes: A1–O2 ────────────────────────────────────────────────
  // Section 1 → morning shift, uses Room-X
  // Section 2 → afternoon shift, uses same Room-X
  const allSubjectIds = subjects.map(s => s.id);
  const allRoomIds = rooms.map(r => r.id);

  const classes: ClassGroup[] = [];
  for (const letter of letters) {
    classes.push({
      id: `cls_${letter}1`,
      name: `${letter}1`,
      subjects: allSubjectIds,
      allowedRooms: [`room_${letter}`],       // dedicated room for section 1
      allowedTimeslots: morningIds,
    });
    classes.push({
      id: `cls_${letter}2`,
      name: `${letter}2`,
      subjects: allSubjectIds,
      allowedRooms: [`room_${letter}`],       // same dedicated room for section 2
      allowedTimeslots: afternoonIds,
    });
  }

  return { teachers, subjects, rooms, timeslots, classes };
}

export function getSubjectColor(subjectId: string, subjects: Subject[]): string {
  return subjects.find(s => s.id === subjectId)?.color ?? '#9ca3af';
}

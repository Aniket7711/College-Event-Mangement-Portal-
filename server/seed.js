require('dotenv').config();
const mongoose = require('mongoose');
const User = require('./models/User');
const Event = require('./models/Event');
const Registration = require('./models/Registration');
const Feedback = require('./models/Feedback');

async function seedDB() {
  try {
    console.log('Connecting to MongoDB...');
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('Connected! Clearing existing data...');

    await User.deleteMany({});
    await Event.deleteMany({});
    await Registration.deleteMany({});
    await Feedback.deleteMany({});

    console.log('Creating users...');
    
    // Create Admin
    const admin = new User({
      name: 'College Admin',
      email: 'admin@college.edu',
      password: 'password123',
      role: 'admin',
      department: 'Administration',
      rollNumber: 'ADM-001',
      year: 'Staff'
    });
    await admin.save();

    // Create Organizer
    const organizer = new User({
      name: 'Tech Club President',
      email: 'techclub@college.edu',
      password: 'password123',
      role: 'organizer',
      department: 'Computer Science',
      rollNumber: 'ORG-101',
      year: 'Third Year'
    });
    await organizer.save();

    // Create Students
    const student1 = new User({
      name: 'Alice Smith',
      email: 'alice@college.edu',
      password: 'password123',
      role: 'student',
      department: 'Computer Science',
      rollNumber: 'CS-2023-001',
      year: 'Second Year'
    });
    await student1.save();

    const student2 = new User({
      name: 'Bob Johnson',
      email: 'bob@college.edu',
      password: 'password123',
      role: 'student',
      department: 'Mechanical Engineering',
      rollNumber: 'ME-2022-045',
      year: 'Third Year'
    });
    await student2.save();

    console.log('Creating events...');

    // Event 1: Hackathon (Approved, Upcoming)
    const futureDate = new Date();
    futureDate.setDate(futureDate.getDate() + 14);

    const hackathon = new Event({
      title: 'Global Hackathon 2026',
      shortDescription: '48-hour coding marathon to solve real-world problems.',
      fullDescription: 'A 48-hour coding marathon to solve real-world campus problems using AI and ML. Prizes worth $5000!',
      date: futureDate.toISOString().split('T')[0],
      startTime: '09:00',
      endTime: '18:00',
      venue: 'Main Auditorium',
      category: 'Hackathon',
      totalSeats: 200,
      posterUrl: 'https://images.unsplash.com/photo-1504384308090-c894fdcc538d?auto=format&fit=crop&q=80',
      organizerId: organizer._id,
      organizerName: organizer.name,
      status: 'approved',
      department: 'Computer Science',
      tags: ['coding', 'ai', 'prize']
    });
    await hackathon.save();

    // Event 2: Cultural Fest (Approved, Upcoming)
    const festDate = new Date();
    festDate.setDate(festDate.getDate() + 30);

    const fest = new Event({
      title: 'Symphony Annual Fest',
      shortDescription: 'The biggest cultural festival of the year.',
      fullDescription: 'The biggest cultural festival of the year featuring music, dance, drama, and celebrity performances.',
      date: festDate.toISOString().split('T')[0],
      startTime: '10:00',
      endTime: '22:00',
      venue: 'University Ground',
      category: 'Fest',
      totalSeats: 5000,
      posterUrl: 'https://images.unsplash.com/photo-1540039155732-680854536baba?auto=format&fit=crop&q=80',
      organizerId: organizer._id,
      organizerName: organizer.name,
      status: 'approved',
      department: 'All Departments',
      tags: ['music', 'dance', 'fun']
    });
    await fest.save();

    // Event 3: Pending Approval
    const pendingDate = new Date();
    pendingDate.setDate(pendingDate.getDate() + 5);

    const workshop = new Event({
      title: 'Robotics Workshop for Beginners',
      shortDescription: 'Build line-follower robots using Arduino.',
      fullDescription: 'Hands-on session on building line-follower robots using Arduino.',
      date: pendingDate.toISOString().split('T')[0],
      startTime: '14:00',
      endTime: '17:00',
      venue: 'Lab 3, Engineering Block',
      category: 'Workshop',
      totalSeats: 50,
      posterUrl: 'https://images.unsplash.com/photo-1561557944-6e7860d1a7eb?auto=format&fit=crop&q=80',
      organizerId: organizer._id,
      organizerName: organizer.name,
      status: 'pending',
      department: 'Electronics',
      tags: ['robotics', 'arduino']
    });
    await workshop.save();

    // Event 4: Past Completed Event
    const pastDate = new Date();
    pastDate.setDate(pastDate.getDate() - 10);

    const sports = new Event({
      title: 'Inter-Department Basketball Finals',
      shortDescription: 'The thrilling conclusion: CS vs ME.',
      fullDescription: 'The thrilling conclusion to the month-long tournament. CS vs ME.',
      date: pastDate.toISOString().split('T')[0],
      startTime: '16:00',
      endTime: '19:00',
      venue: 'Indoor Stadium',
      category: 'Sports',
      totalSeats: 500,
      posterUrl: 'https://images.unsplash.com/photo-1504450758481-7338eba7524a?auto=format&fit=crop&q=80',
      organizerId: organizer._id,
      organizerName: organizer.name,
      status: 'completed',
      department: 'Physical Education',
      tags: ['sports', 'basketball', 'finals']
    });
    await sports.save();

    console.log('Creating registrations...');

    // Register Student 1 for Hackathon
    await new Registration({
      studentId: student1._id,
      studentName: student1.name,
      studentEmail: student1.email,
      studentRollNumber: student1.rollNumber,
      eventId: hackathon._id,
      eventTitle: hackathon.title,
      qrToken: 'hackathon-ticket-' + student1._id.toString().substring(0, 8),
      status: 'registered'
    }).save();

    // Register Student 2 for Fest
    await new Registration({
      studentId: student2._id,
      studentName: student2.name,
      studentEmail: student2.email,
      studentRollNumber: student2.rollNumber,
      eventId: fest._id,
      eventTitle: fest.title,
      qrToken: 'fest-ticket-' + student2._id.toString().substring(0, 8),
      status: 'registered'
    }).save();

    // Check-in someone to the past sports event
    await new Registration({
      studentId: student1._id,
      studentName: student1.name,
      studentEmail: student1.email,
      studentRollNumber: student1.rollNumber,
      eventId: sports._id,
      eventTitle: sports.title,
      qrToken: 'sports-ticket-' + student1._id.toString().substring(0, 8),
      status: 'attended',
      checkedInAt: pastDate.toISOString()
    }).save();

    console.log('Creating feedback...');
    
    // Student 1 leaves feedback for Sports
    await new Feedback({
      studentId: student1._id,
      studentName: student1.name,
      eventId: sports._id,
      eventTitle: sports.title,
      rating: 5,
      comment: 'Amazing match! The energy was incredible and everything was well-organized.'
    }).save();

    console.log('✅ Seed completed successfully!');
    console.log('\n--- Dummy Credentials ---');
    console.log('Admin:     admin@college.edu / password123');
    console.log('Organizer: techclub@college.edu / password123');
    console.log('Student:   alice@college.edu / password123');
    console.log('---------------------------\n');
    
    process.exit(0);
  } catch (error) {
    console.error('Error seeding database:');
    if (error.errors) {
      console.error(JSON.stringify(error.errors, null, 2));
    } else {
      console.error(error.message);
    }
    process.exit(1);
  }
}

seedDB();

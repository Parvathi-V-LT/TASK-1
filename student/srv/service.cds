namespace sample.srv;

using {sample.db as db } from '../db/schema';

service studentapi {
   entity students as projection on db.Students;
   entity courses as projection on db.course;
   entity studentcourses as projection on db.studentcourses;
   entity StudentTeacher as projection on db.StudentTeacher;
   entity Teacher as projection on db.Teacher;
   entity order as projection on db.order;
   entity orderItem as projection on db.orderItem;
   entity orderPlaced as projection on db.orderPlaced;
   entity nurse as projection on db.nurse;
   entity nurseAssignment as projection on db.nurseAssignment;
   entity patient as projection on db.patient;
}

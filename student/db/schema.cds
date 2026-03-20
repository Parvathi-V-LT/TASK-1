namespace sample.db;

//@requires :'authenticated-user'
//entity student //@(restrict:[
   /*  {grant :'READ',to:'authenticated-user'},
    {grant :'CREATE',to:'admin'},
    {grant :'UPDATE',to:'admin'} */
//])


entity Students{
    key id:String;
    name:String;
    st:Association to many studentcourses on st.students = $self;
    TeachAss:Association to many StudentTeacher on TeachAss.student_id=$self;
}


entity course
{
    key id : String;
    course_name : String;
    status : String;
    st : Association to many studentcourses on st.course = $self;

}


entity studentcourses
{
    key id : String;
    course : Association to one course;
    students : Association to one Students;
}



entity Teacher{
    key id :String;
    name:String;
    location:String;
    StudentTeacher:Association to many StudentTeacher on StudentTeacher.teacher_id = $self;
}

entity StudentTeacher{
    key id:String;
    student_id:Association to Students;
    teacher_id:Association to Teacher;

}


entity order {
    key id :String;
    name:String;
    OrderDate:Date;
    orderPlace:Composition of many orderPlaced on orderPlace.order_id = $self;
}

entity orderPlaced{
    key id:String;
    order_id:Association to order;
    orderItem_id:Association to orderItem;
}

entity orderItem{
    key id :String;
    name:String;
    Type:String;
    orderPlaced:Composition of many orderPlaced on orderPlaced.orderItem_id = $self;
}

entity nurse{
    key id:String;
    name:String;
    location:String;
    nurseAss:Composition of many nurseAssignment on nurseAss.nurse_id = $self;

}
entity nurseAssignment{
    key id:String;
    nurse_id:Association to nurse;
    patient_id:Association to patient;
}

entity patient{
    key id:String;
    name:String;
    description:String;
    nurseAss:Composition of many nurseAssignment on nurseAss.patient_id = $self;
}
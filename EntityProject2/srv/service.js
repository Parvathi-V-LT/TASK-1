const cds = require('@sap/cds');
const { SELECT, UPDATE, INSERT } = require('@sap/cds/lib/ql/cds-ql');

module.exports = cds.service.impl(async function () {

    const { hospital, department, doctor, receptionist, patient, appointment, PatientRecord,attenance, prescription, labtest, billing, payment, nurse, ward } = this.entities;


    //HOSPITAL
    this.before('CREATE', hospital, async (req) => {

        const { ID, ContactNo } = req.data;

        if (ContactNo.length !== 10) {
            req.error('Contact Number should be length in 10')
        }

        const exists = await SELECT.one.from(hospital).where({ ID });

        if (exists) {
            req.error(400, `Hospital with ID ${ID} already exists`);
        }
    });


    this.before('DELETE', hospital, async (req) => {

        const { ID } = req.data;

        const deptExists = await SELECT.one.from(department).where({ HospialID: ID });

        if (deptExists) {
            req.error(400, `Cannot delete hospital... department exists`)
        }

    });

    this.after('CREATE', hospital, async (req) => {

        return `Hospital inserted succesfully`;
    })

    //DEPARTMENT
    this.before('CREATE', department, async (req) => {

        const { name, HospialID_ID } = req.data;

        const existsName = await SELECT.one.from(department).where({ name: name, HospialID_ID: HospialID_ID });

        if (existsName) {
            req.error(`Department ${name} is already exists`);
        }
    });


    //DOCTOR
    this.before('CREATE', doctor, async (req) => {
        const { Experience } = this.entities;

        if (Experience <= 0) { //convert string to integer
            req.error(`Experience should not be less than or equal to ${Experience}`);
        }

    });



    //PATIENT
    this.before('CREATE', patient, async (req) => {
        if (!req.data.Status) {
            req.data.Status = "Active";
        }
        const { ID } = req.data;

        const exists = await SELECT.one.from(patient).where({ ID });

        if (exists) {
            req.error(400, `Patient with ID ${ID} already exists`);
        }
    });



    //APPOINTMENT
    // this.before('CREATE', appointment, async (req) => {

    //     const {docID, Date, Time} = req.data;

    //     const exists = await SELECT.from(appointment).where({docID_ID : docID, Date : Date, Time : Time});

    //     if(exists){
    //         req.error(`No Double entry`);
    //     }

    // })



    //not working
    this.after('CREATE', appointment, async (req, data) => {
        data.Msg = `Successfully Bookd the appointment for ${data.name}`;

        return data;
    })



    //Implement the actions for change the status to completed.....


    //PATIENT RECORD
    this.before('CREATE', PatientRecord, async (req) => {

        const { AptID_ID } = req.data;

        if (!req.data.Next_Visit_Date) {
            req.data.Next_Visit_Date = null;
        }

        const appointmentexists = await SELECT.one.from(appointment).where({ ID: AptID_ID });

        if (appointmentexists.Status !== 'Completed') {
            req.error('Patient Record will be able to create once the appointment status is in completed State')
        }
    })




    //generate the bill with prescriptions............
    //BILLING

    /*  this.on('CREATE', billing, async (req, next) => {
  
         const {AptID_ID } = req.data;
  
         const appointmentdata = await SELECT.one.from(appointment).where({ID : AptID_ID});
        
         if(appointmentdata.Consultation_Fee > 0){
             req.data.Amount = appointmentdata.Consultation_Fee;
             req.data.Bill_Status = "Generated";
         }
  
         await next();
  
     }); */


    //RECEPTIONIST
    this.before('CREATE', receptionist, async (req) => {

        const { ID, Contant_No } = req.data;
        //console.log(Contact_No);


        if (Contant_No.length !== 10) {
            req.error('Enter a valid Contact No');
        }

        if (!ID) {
            req.error('ID for receptionist is mandatory');
        }

    })

    this.on('CREATE', receptionist, async (req, next) => {

        if (!req.data.Status) {
            req.data.Status = "Active";
        }

        await next();
    })


    this.on('getTotalDepartments', async (req) => {

        const { department } = this.entities;

        const total_dept = await SELECT.from(department);

        return total_dept.length;

    });

    this.on('doctorAppointments', async (req) => {

        const { appointment } = this.entities;
        const { id } = req.data;

        const doctorappointment = await SELECT.from(appointment).where({ docID_ID: id });

        return doctorappointment.length;

    })

    this.on('getUpcomingAppointments', async (req) => {

        const { appointment } = this.entities;
        const { id, Status } = req.data;

        const UpcomingTotalAppointmens = await SELECT.from(appointment).where({ docID_ID: id, Status: Status });

        return UpcomingTotalAppointmens.length;
    })

    //calculate all the bill amount...

    //calculate how many doctors are available today.... and who are all they.... create one attendance entity.....
    //according to that we have to assign the doctor for patients....


    //ACTIONS

    this.on('approveAppointment', async (req) => {

        const { ID } = req.data;


        const Details = await SELECT.from(appointment).where({ ID });

        //console.log(Details);

        if (Details.Status === "Booked") {

            await UPDATE(appointment).set({ Status: 'Approved' }).where({ ID });
            return `Appointment Approved Successfully`;

        } else {
            req.error(`Not updated`)
        }

    })


    //update the status once it is completed.....


    this.on('cancelAppointment', async (req) => {

        const { ID } = req.data;

        await UPDATE(appointment).set({ Status: 'Cancelled' }).where({ ID });
        return `Appointment Approved Successfully`;


    })



    // this.on('getTotalPatient', async (req) => {

    //     const { payment, billing } = this.entities;

    //     const total_patient = await SELECT.from(payment);

    //     for (const element of total_patient) {

    //         console.log(element.Payment_Status, element.BillID_ID);
    //         const BillElement = await SELECT.from(billing).where({ ID: element.BillID_ID })
    //         console.log(BillElement);

    //         for (const ele of BillElement) {
    //             const Apt = await SELECT.from(appointment).where({ ID: ele.AptID_ID });
    //             console.log(Apt);

    //             for (const pat of Apt) {
    //                 const patientdetail = await SELECT.from(patient).where({ ID: pat.PatID_ID })
    //                 console.log(patientdetail);

    //                 if (element.Payment_Status == 'UnPaid') {
    //                     console.log(patientdetail.Patient_name, ":", element.Payment_Staus);

    //                 }

    //             }

    //         }


    //     };

    // }); 


    this.on('FindUnpaidPatient', async (req) => {

        const { payment, billing, appointment, patient } = this.entities;
        const total_payment = await SELECT.from(payment);
        const unpaidPatients = [];

        for (const pay of total_payment) {
            if (pay.Payment_Status !== 'UnPaid') continue;
            const billList = await SELECT.from(billing).where({ ID: pay.BillID_ID });

            for (const bill of billList) {
                const aptList = await SELECT.from(appointment).where({ ID: bill.AptID_ID });

                for (const apt of aptList) {
                    const patList = await SELECT.from(patient).where({ ID: apt.PatID_ID });

                    for (const pat of patList) {
                        unpaidPatients.push({
                            Patient_name: pat.Patient_name,
                            Payment_Status: pay.Payment_Status
                        });

                    }
                }
            }
        }

        console.log(unpaidPatients);
        return unpaidPatients;
    });

    this.on('getTotalPatient', async (req) => {

        const { patient } = this.entities;

        const total_patient = await SELECT.from(patient);

        return total_patient.length;

    });
   
     //Get appointment by doctor
   this.on('getAppointmentByDoctor', async (req) => {
        const { doctor_Id } = req.data;
        if(!doctor_Id){
          req.error("Doctor ID is reqired")
        }
     
        const result = await SELECT.from(appointment).where({docID_ID: doctor_Id });
        console.log(result);
        
        return result.length;
    });
   
    //this.before('CREATE',appointment)

   this.on ('CREATE',appointment,async(req)=>{
        const{docID_ID}=req.data;
        console.log(docID_ID);
        
        const doctor = await SELECT.from(attenance).where({doctor_Id_ID:docID_ID});
        console.log(doctor);
        if(doctor[0].status == 'Absent')
        {
            req.error("sorry , doctor is absent")
            console.log("Sorry , doctor is absent");
            
        }
        else
        {
          const createAppointment = await INSERT.into(appointment).entries(req.data);
        }
   })

})
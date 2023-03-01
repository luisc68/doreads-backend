import { Role, Student, StudentStatus } from "@prisma/client";
import prisma from "../database/client";
import { CustomError, HttpError } from "../types/custom.error";
import  {paginateResult}  from "../helpers/pagination.helper";

class StudentService {
  /** It creates a new student in the database
   * @param {Student} student - The student data
   * @returns A promise
   */
  async create(student: Student) {
    const newStudent = await prisma.student.create({
      data: {
        ...student,
      },
    });
    if (!newStudent) {
      throw new CustomError("Error creating student");
    }
    return { message: "Student created successfully" };
  }
  /**
   * It changes the student's status
   * @param {number} studentId - The student id
   * @param {StudentStatus} status - The student status
   * @returns A promise
   */
  async changeStudentStatus(studentId: number, status: StudentStatus) {
    const updateStudent = await prisma.student.update({
      where: {
        id: studentId,
      },
      data: {
        status,
      },
    });
    if (!updateStudent) {
      throw new CustomError("Error updating student");
    }
    return { message: "Student updated successfully" };
  }
  /**
   * It gets all the students
   * @returns A promise
   */
  async getAllStudents(limit: number, offset: number) {
    const count = await prisma.student.count()
    const result = await prisma.student.findMany({
      take: limit,
      skip: offset,
    });
  
    if (!result) {
      throw new CustomError("Error getting students");
    }
  
    const paginatedResult = paginateResult(result, limit, offset,count);
  
    return paginatedResult;
  }
  /**
   * It gets a student by id
   * @param {number} studentId - The student id
   * @returns A promise
   */
  async getStudentById(studentId: number) {
    const studentById = await prisma.student.findUnique({
      where: {
        id: studentId,
      },
    });
    if (!studentById) {
      throw new CustomError("Error getting student");
    }
    return studentById;
  }
  /**
   * It deletes a student by id, and locks the function to only be called by the admin
   */    
  async deleteStudentById(studentId: number, role: Role) {
    if (role !== "ADMIN") {
      return new HttpError("You are not authorized to perform this action", 401);
    }
    const deleteStudent = await prisma.student.delete({
      where: {
        id: studentId,
      },
    });
    if (!deleteStudent) {
      throw new CustomError("Error deleting student");
    }
    return { message: "Student deleted successfully" };
  }
  /**
   * It updates the student's details
   * @param {Student} student - The student whose details are to be updated
   * @param {number} studentId - The student's id
   * @returns A promise
   */
  async updateStudent(student: Student, studentId: number) {
    const updateStudent = await prisma.student.update({
      where: {
        id: studentId,
      },
      data: {
        ...student,
      },
    });
    if (!updateStudent) {
      throw new CustomError("Error updating student");
    }
    return { message: "Student updated successfully" };
  } 
}

export default new StudentService();

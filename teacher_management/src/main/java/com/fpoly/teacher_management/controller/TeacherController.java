package com.fpoly.teacher_management.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.web.server.ResponseStatusException;

import com.fpoly.teacher_management.model.Teacher;
import com.fpoly.teacher_management.model.TeacherType;
import com.fpoly.teacher_management.entity.RequestTeacher;
import com.fpoly.teacher_management.model.EducationLevel;
import com.fpoly.teacher_management.service.TeacherService;
import com.fpoly.teacher_management.service.TeacherTypeService;
import com.fpoly.teacher_management.service.EducationLevelService;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.time.LocalDate;
import java.util.List;
import java.util.Optional;
import java.util.UUID;

@RestController
@RequestMapping("/teachers")
@CrossOrigin(origins = "http://localhost:3000")
public class TeacherController {

    @Autowired
    private TeacherService teacherService;

    @Autowired
    private TeacherTypeService teacherTypeService;

    @Autowired
    private EducationLevelService educationLevelService;

    @GetMapping
    public ResponseEntity<List<Teacher>> getAllTeachers() {
        List<Teacher> teachers = teacherService.getAllTeachers();
        return ResponseEntity.ok(teachers);
    }

    @GetMapping("/{id}")
    public ResponseEntity<Teacher> getTeacherById(@PathVariable String id) {
        Optional<Teacher> teacher = teacherService.getTeacherById(id);
        return teacher.map(ResponseEntity::ok)
                .orElseGet(() -> ResponseEntity.notFound().build());
    }

    @PostMapping
    public ResponseEntity<Teacher> createTeacher(@RequestParam(value = "file", required = false) MultipartFile file,
                                                 @RequestParam("teacherId") String teacherId,
                                                 @RequestParam("firstName") String firstName,
                                                 @RequestParam("lastName") String lastName,
                                                 @RequestParam("teacherTypeId") Integer teacherTypeId,
                                                 @RequestParam("educationLevelId") Integer educationLevelId,
                                                 @RequestParam("baseSalary") int baseSalary,
                                                 @RequestParam("startDate") LocalDate startDate) {
        try {
            // Save file if it's present
            String imageName = null;
            if (file != null && !file.isEmpty()) {
                imageName = saveFile(file);
            }

            // Convert IDs to actual entities
            Optional<TeacherType> teacherTypeOpt = teacherTypeService.getTeacherTypeById(teacherTypeId);
            Optional<EducationLevel> educationLevelOpt = educationLevelService.getEducationLevelById(educationLevelId);

            if (!teacherTypeOpt.isPresent() || !educationLevelOpt.isPresent()) {
                return ResponseEntity.badRequest().build();
            }

            TeacherType teacherType = teacherTypeOpt.get();
            EducationLevel educationLevel = educationLevelOpt.get();

            // Create a new Teacher entity
            Teacher teacher = new Teacher();
            teacher.setTeacherId(teacherId);
            teacher.setFirstName(firstName);
            teacher.setLastName(lastName);
            teacher.setTeacherType(teacherType);
            teacher.setEducationLevel(educationLevel);
            teacher.setImage(imageName);
            teacher.setBaseSalary(baseSalary);
            teacher.setStartDate(startDate);

            Teacher savedTeacher = teacherService.saveTeacher(teacher);
            return ResponseEntity.status(HttpStatus.CREATED).body(savedTeacher);

        } catch (IOException e) {
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(null);
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(null);
        }
    }

    @PutMapping("/{id}")
    public ResponseEntity<Teacher> updateTeacher(@PathVariable String id,
                                                 @RequestParam(value = "file", required = false) MultipartFile file,
                                                 @RequestParam("firstName") String firstName,
                                                 @RequestParam("lastName") String lastName,
                                                 @RequestParam("teacherTypeId") Integer teacherTypeId,
                                                 @RequestParam("educationLevelId") Integer educationLevelId,
                                                 @RequestParam("baseSalary") int baseSalary,
                                                 @RequestParam("startDate") String startDate) {
        try {
            // Find the existing teacher by ID
            Teacher existingTeacher = teacherService.getTeacherById(id)
                    .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Teacher not found"));

            // Ensure teacherType and educationLevel are provided in the request
            if (teacherTypeId == null || educationLevelId == null) {
                return ResponseEntity.badRequest().build();
            }

            // Fetch the related entities (TeacherType, EducationLevel)
            TeacherType teacherType = teacherTypeService.getTeacherTypeById(teacherTypeId)
                    .orElseThrow(() -> new ResponseStatusException(HttpStatus.BAD_REQUEST, "Invalid Teacher Type ID"));

            EducationLevel educationLevel = educationLevelService.getEducationLevelById(educationLevelId)
                    .orElseThrow(() -> new ResponseStatusException(HttpStatus.BAD_REQUEST, "Invalid Education Level ID"));

            // Update the existing teacher's details
            existingTeacher.setFirstName(firstName);
            existingTeacher.setLastName(lastName);
            existingTeacher.setTeacherType(teacherType);
            existingTeacher.setEducationLevel(educationLevel);
            existingTeacher.setBaseSalary(baseSalary);
            existingTeacher.setStartDate(LocalDate.parse(startDate));

            // Save the image file if provided
            if (file != null && !file.isEmpty()) {
                String imageName = saveFile(file);
                existingTeacher.setImage(imageName);
            }

            // Save the updated teacher
            Teacher updatedTeacher = teacherService.saveTeacher(existingTeacher);
            return ResponseEntity.ok(updatedTeacher);
        } catch (IOException e) {
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(null);
        } catch (ResponseStatusException e) {
            // Catch specific exceptions and respond with appropriate status
            return ResponseEntity.status(e.getStatusCode()).build();
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteTeacher(@PathVariable String id) {
        teacherService.deleteTeacher(id);
        return ResponseEntity.noContent().build();
    }

    @GetMapping("/search/byLastName")
    public ResponseEntity<List<Teacher>> getTeachersByLastName(@RequestParam String lastName) {
        List<Teacher> teachers = teacherService.getTeachersByLastName(lastName);
        return ResponseEntity.ok(teachers);
    }

    @GetMapping("/search/byTeacherType")
    public ResponseEntity<List<Teacher>> getTeachersByTeacherType(@RequestParam Integer teacherType) {
        List<Teacher> teachers = teacherService.getTeachersByTeacherType(teacherType);
        return ResponseEntity.ok(teachers);
    }

    @GetMapping("/search/byEducationLevel")
    public ResponseEntity<List<Teacher>> getTeachersByEducationLevel(@RequestParam Integer educationLevel) {
        List<Teacher> teachers = teacherService.getTeachersByEducationLevel(educationLevel);
        return ResponseEntity.ok(teachers);
    }

    private String saveFile(MultipartFile file) throws IOException {
        String originalFileName = file.getOriginalFilename();
        if (originalFileName == null) {
            throw new IllegalArgumentException("Invalid file name");
        }

        String uuid = UUID.randomUUID().toString();
        String extension = "";
        int i = originalFileName.lastIndexOf('.');
        if (i > 0) {
            extension = originalFileName.substring(i);
        }

        String newFileName = uuid + extension;
        Path path = Paths.get("uploads/" + newFileName);
        Files.createDirectories(path.getParent());
        Files.write(path, file.getBytes());

        return newFileName;
    }

    @GetMapping("/images/{filename}")
    public ResponseEntity<byte[]> getImage(@PathVariable String filename) {
        try {
            Path imagePath = Paths.get("uploads/" + filename);
            byte[] imageBytes = Files.readAllBytes(imagePath);
            return ResponseEntity.ok()
                    .contentType(MediaType.IMAGE_JPEG)
                    .body(imageBytes);
        } catch (IOException e) {
            return ResponseEntity.notFound().build();
        }
    }

}

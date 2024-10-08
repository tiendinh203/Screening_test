import React, { useState, useEffect, useRef } from "react";

const API_BASE_URL = "http://localhost:8081";
const defaultImage = 'data:image/png;base64,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';

const today = new Date().toISOString().split('T')[0];
const initData = {
  teacherId: "",
  firstName: "",
  lastName: "",
  teacherTypeId: 1,
  educationLevelId: 1,
  image: null, 
  baseSalary: 0,
  startDate: today,
};

const TeacherManagement = () => {
  const [teachers, setTeachers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [newTeacher, setNewTeacher] = useState(initData);
  const [isEditing, setIsEditing] = useState(false);
  const [educationLevels, setEducationLevels] = useState([]);
  const [teacherTypes, setTeacherTypes] = useState([]);
  const fileInputRef = useRef(null);
  const [imageSrc, setImageSrc] = useState(defaultImage);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [teacherRes, teacherTypesRes, educationLevelsRes] = await Promise.all([
          fetch(`${API_BASE_URL}/teachers`),
          fetch(`${API_BASE_URL}/teacherTypes`),
          fetch(`${API_BASE_URL}/educationLevels`)
        ]);

        if (!teacherRes.ok || !teacherTypesRes.ok || !educationLevelsRes.ok) {
          throw new Error("Failed to fetch data");
        }

        const teachersData = await teacherRes.json();
        const teacherTypesData = await teacherTypesRes.json();
        const educationLevelsData = await educationLevelsRes.json();

        setTeachers(teachersData);
        setTeacherTypes(teacherTypesData);
        setEducationLevels(educationLevelsData);
      } catch (error) {
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  useEffect(() => {
    const updateImageSrc = async () => {
      if (isEditing && newTeacher.image) {
        try {
          const response = await fetch(`${API_BASE_URL}/teachers/images/${newTeacher.image}`);
          if (response.ok) {
            setImageSrc(`${API_BASE_URL}/teachers/images/${newTeacher.image}`);
          } else {
            setImageSrc(defaultImage);
          } 
        } catch (error) {
          const reader = new FileReader();
          reader.onloadend = () => {
            setImageSrc(reader.result);
          };
          reader.readAsDataURL(newTeacher.image);
        }
      } else if (newTeacher.image) {
        const reader = new FileReader();
        reader.onloadend = () => {
          setImageSrc(reader.result);
        };
        reader.readAsDataURL(newTeacher.image);
      } else {
        setImageSrc(defaultImage);
      }
    };

    updateImageSrc();
  }, [newTeacher.image, isEditing]);

  const handleCreateOrUpdate = async () => {
    try {
      const method = isEditing ? "PUT" : "POST";

      if (method === "POST" && newTeacher.teacherId === '') {
        alert("Mã giáo viên không được bỏ trống");
        return;
      }

      const formData = new FormData();
      formData.append('teacherId', newTeacher.teacherId);
      formData.append('firstName', newTeacher.firstName);
      formData.append('lastName', newTeacher.lastName);
      formData.append('teacherTypeId', newTeacher.teacherTypeId);
      formData.append('educationLevelId', newTeacher.educationLevelId);
      formData.append('baseSalary', newTeacher.baseSalary);
      formData.append('startDate', newTeacher.startDate);
      
      if (newTeacher.image) {
        formData.append('file', newTeacher.image);
      }

      const url = isEditing
        ? `${API_BASE_URL}/teachers/${newTeacher.teacherId}`
        : `${API_BASE_URL}/teachers`;

      const response = await fetch(url, {
        method: method,
        body: formData,
      });

      if (!response.ok) throw new Error("Failed to save teacher");

      const savedTeacher = await response.json();

      if (isEditing) {
        setTeachers(
          teachers.map((teacher) =>
            teacher.teacherId === newTeacher.teacherId ? savedTeacher : teacher
          )
        );
        setIsEditing(false);
      } else {
        setTeachers([...teachers, savedTeacher]);
      }

      resetForm();
    } catch (error) {
      setError(error.message);
    }
  };

  const handleEdit = (teacher) => {
    setIsEditing(true);
    setNewTeacher({
      ...teacher,
      startDate: teacher.startDate.split('T')[0],
      teacherTypeId: teacher.teacherType.id,
      educationLevelId: teacher.educationLevel.id,
    });
  };

  const handleDelete = async (id) => {
    try {
      const response = await fetch(`${API_BASE_URL}/teachers/${id}`, {
        method: "DELETE",
      });

      if (!response.ok) throw new Error("Failed to delete teacher");

      setTeachers(teachers.filter((teacher) => teacher.teacherId !== id));
      resetForm()
    } catch (error) {
      setError(error.message);
    }
  };

  const resetForm = () => {
    setNewTeacher(initData);
    fileInputRef.current.value = null;
    setImageSrc(defaultImage);
    setIsEditing(false);
  };

  const handleImageChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      setNewTeacher(prevState => ({
        ...prevState,
        image: file
      }));
    }
  };

  const handleImageClick = () => {
    fileInputRef.current.click();
  };

  if (loading) return <p>Loading...</p>;
  if (error) return <p>{error}</p>;

  return (
    <div className="p-6">
      <h2 className="text-center text-red-600 text-2xl font-bold mb-6">Quản lý giảng viên</h2>
      <div className="max-w-xl mx-auto bg-white shadow-md rounded-lg p-6">
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 text-left">Mã giáo viên</label>
          <input
            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
            type="text"
            value={newTeacher.teacherId}
            onChange={(e) => setNewTeacher({ ...newTeacher, teacherId: e.target.value })}
            disabled={isEditing}
          />
        </div>
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 text-left">Họ</label>
          <input
            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
            type="text"
            value={newTeacher.firstName}
            onChange={(e) => setNewTeacher({ ...newTeacher, firstName: e.target.value })}
          />
        </div>
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 text-left">Tên</label>
          <input
            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
            type="text"
            value={newTeacher.lastName}
            onChange={(e) => setNewTeacher({ ...newTeacher, lastName: e.target.value })}
          />
        </div>
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 text-left">Loại giáo viên</label>
          <select
            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
            value={newTeacher.teacherTypeId}
            onChange={(e) => setNewTeacher({ ...newTeacher, teacherTypeId: parseInt(e.target.value) })}
          >
            {teacherTypes.map((type) => (
              <option key={type.id} value={type.id}>{type.typeName}</option>
            ))}
          </select>
        </div>
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 text-left">Trình độ</label>
          <select
            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
            value={newTeacher.educationLevelId}
            onChange={(e) => setNewTeacher({ ...newTeacher, educationLevelId: parseInt(e.target.value) })}
          >
            {educationLevels.map((level) => (
              <option key={level.id} value={level.id}>{level.levelName}</option>
            ))}
          </select>
        </div>
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 text-left">Lương cơ bản</label>
          <input
            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
            type="number"
            value={newTeacher.baseSalary}
            onChange={(e) => setNewTeacher({ ...newTeacher, baseSalary: e.target.value })}
          />
        </div>
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 text-left">Ngày bắt đầu</label>
          <input
            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
            type="date"
            value={newTeacher.startDate}
            onChange={(e) => setNewTeacher({ ...newTeacher, startDate: e.target.value })}
          />
        </div>
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 text-left">Hình ảnh</label>
          <div className="flex items-center">
            <img
              src={imageSrc}
              alt="Teacher"
              className="w-24 h-24 object-cover rounded-full border border-gray-300"
              onClick={handleImageClick}
            />
            <input
              type="file"
              accept="image/*"
              ref={fileInputRef}
              style={{ display: 'none' }}
              onChange={handleImageChange}
            />
          </div>
        </div>
        <div className="flex justify-end">
          <button
            className="bg-blue-500 text-white px-4 py-2 rounded-lg shadow-md mr-2"
            onClick={handleCreateOrUpdate}
          >
            {isEditing ? "Cập nhật" : "Tạo mới"}
          </button>
          <button
            className="bg-gray-500 text-white px-4 py-2 rounded-lg shadow-md"
            onClick={resetForm}
          >
            Hủy
          </button>
        </div>
      </div>
      <div className="mt-8">
        <h3 className="text-lg font-semibold mb-4">Danh sách giáo viên</h3>
        <table className="table table-striped mt-3">
        <thead>
          <tr>
            <th>Mã giáo viên</th>
            <th>Họ</th>
            <th>Tên</th>
            <th>Loại giáo viên</th>
            <th>Trình độ</th>
            <th>Lương cơ bản</th>
            <th>Ngày bắt đầu</th>
            <th>Hình ảnh</th>
            <th>Hành động</th>
          </tr>
        </thead>
        <tbody>
          {teachers.map((teacher) => (
            <tr key={teacher.teacherId}>
              <td>{teacher.teacherId}</td>
              <td>{teacher.firstName}</td>
              <td>{teacher.lastName}</td>
              <td>{teacher.teacherType.typeName}</td>
              <td>{teacher.educationLevel.levelName}</td>
              <td>{teacher.baseSalary}</td>
              <td>{teacher.startDate}</td>
              <td>
                <img
                  src={`${API_BASE_URL}/teachers/images/${teacher.image || defaultImage}`}
                  alt="Teacher"
                  className="img-thumbnail"
                  style={{ width: '100px', height: '100px', objectFit: 'cover' }}
                />
              </td>
              <td>
                <button className="btn btn-warning btn-sm me-2" onClick={() => handleEdit(teacher)}>
                  Sửa
                </button>
                <button className="btn btn-danger btn-sm" onClick={() => handleDelete(teacher.teacherId)}>
                  Xóa
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      </div>
    </div>
  );
};

export default TeacherManagement;

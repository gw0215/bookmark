import axios from "axios";
import { useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import CreatableSelect from "react-select/creatable";
import Select from "react-select";
import "react-toastify/dist/ReactToastify.css";
import styles from "../styles/AddBookmark.module.css";

function AddBookmark() {
  const [title, setTitle] = useState("");
  const [url, setUrl] = useState("");
  const [memo, setMemo] = useState("");
  const [selectedTags, setSelectedTags] = useState([]);
  const [category, setCategory] = useState(null);

  const navigate = useNavigate();

  const tagOptions = useMemo(() => [
    { value: "react", label: "React" },
    { value: "spring", label: "Spring" },
    { value: "javascript", label: "JavaScript" },
    { value: "ui", label: "UI" },
    { value: "db", label: "Database" },
  ], []);

  const categoryOptions = useMemo(() => [
    { value: "개발", label: "개발" },
    { value: "디자인", label: "디자인" },
    { value: "생활", label: "생활" },
    { value: "기타", label: "기타" },
  ], []);

  const categoryColorMap = useMemo(() => ({
    개발: "#3b82f6",
    디자인: "#f59e0b",
    생활: "#10b981",
    기타: "#6b7280",
  }), []);

  const handleChange = (setter) => (e) => setter(e.target.value);

  const isValidURL = (url) => {
    const pattern = new RegExp(
      "^(https?:\\/\\/)?([\\w\\-])+\\.[\\w\\-]+(\\/[\\w\\-./?%&=]*)?$",
      "i"
    );
    return pattern.test(url);
  };

  const validateForm = () => {
    if (title.trim() === "" || url.trim() === "") {
      toast.error("제목과 URL은 필수입니다.");
      return false;
    }
    if (!isValidURL(url)) {
      toast.error("올바른 URL 형식을 입력해주세요.");
      return false;
    }
    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    try {
      await axios.post("http://localhost:8080/api/bookmarks", {
        title,
        url,
        memo,
        tags: selectedTags.map((tag) => tag.value),
        category: {
          name: category?.value || "기타",
          color: categoryColorMap[category?.value] || "#6b7280",
        },
      });

      toast.success("북마크가 성공적으로 등록되었습니다!");
      setTimeout(() => navigate("/"), 1500);
    } catch (err) {
      console.error("등록 실패:", err);
      toast.error("등록에 실패했습니다. 다시 시도해주세요.");
    }
  };

  const isFormValid = title.trim() !== "" && url.trim() !== "";

  return (
    <div className={styles.container}>
      <h1>북마크 추가</h1>
      <form onSubmit={handleSubmit}>
        <div className={styles.formGroup}>
          <label className={styles.label}>제목</label>
          <input
            className={styles.input}
            value={title}
            onChange={handleChange(setTitle)}
            required
            placeholder="예: 내 포트폴리오"
          />
        </div>

        <div className={styles.formGroup}>
          <label className={styles.label}>URL</label>
          <input
            className={styles.input}
            value={url}
            onChange={handleChange(setUrl)}
            type="url"
            required
            placeholder="예: https://example.com"
          />
        </div>

        <div className={styles.formGroup}>
          <label className={styles.label}>메모</label>
          <textarea
            className={`${styles.input} ${styles.textarea}`}
            value={memo}
            onChange={handleChange(setMemo)}
            placeholder="예: 업무용 사이트"
          />
        </div>

        <div className={styles.formGroup}>
          <label className={styles.label}>태그 선택</label>
          <CreatableSelect
            isMulti
            options={tagOptions}
            value={selectedTags}
            onChange={setSelectedTags}
            placeholder="태그를 입력하거나 선택하세요"
          />
        </div>

        <div className={styles.formGroup}>
          <label className={styles.label}>카테고리 선택</label>
          <Select
            options={categoryOptions}
            value={category}
            onChange={setCategory}
            placeholder="카테고리를 선택하세요"
          />
        </div>

        <br />
        <button
          className={styles.button}
          disabled={!isFormValid}
          type="submit"
        >
          등록
        </button>
      </form>

      <ToastContainer position="top-center" />
    </div>
  );
}

export default AddBookmark;
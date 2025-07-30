import axios from "axios";
import { useEffect, useState, useMemo } from "react";
import { useNavigate, useParams } from "react-router-dom";
import CreatableSelect from "react-select/creatable";
import Select from "react-select";
import styles from "../styles/EditBookmark.module.css";

function EditBookmark() {
  const navigate = useNavigate();
  const { id } = useParams();

  const [title, setTitle] = useState("");
  const [url, setUrl] = useState("");
  const [memo, setMemo] = useState("");
  const [tags, setTags] = useState([]);
  const [category, setCategory] = useState(null);

  const categoryOptions = useMemo(() => [
    { value: "개발", label: "개발" },
    { value: "디자인", label: "디자인" },
    { value: "생활", label: "생활" },
    { value: "기타", label: "기타" },
  ], []);

  useEffect(() => {
    axios.get(`http://localhost:8080/api/bookmarks/${id}`).then((res) => {
      const { title, url, memo, tags, category } = res.data;
      setTitle(title);
      setUrl(url);
      setMemo(memo);
      setTags(tags.map((t) => ({ label: t, value: t })));
      setCategory(category ? { label: category.name, value: category.name } : null);
    });
  }, [id]);

  const handleChange = (setter) => (e) => setter(e.target.value);

  const handleSubmit = (e) => {
    e.preventDefault();

    const updatedBookmark = {
      title,
      url,
      memo,
      tags: tags.map((t) => t.value),
      category: category ? { name: category.value } : null,
    };

    axios.put(`http://localhost:8080/api/bookmarks/${id}`, updatedBookmark)
      .then(() => navigate("/"))
      .catch((err) => console.error("수정 실패:", err));
  };

  return (
    <div className={styles.container}>
      <h2 className={styles.heading}>북마크 수정</h2>
      <form onSubmit={handleSubmit}>
        <div className={styles.formGroup}>
          <label>제목</label>
          <input type="text" value={title} onChange={handleChange(setTitle)} />
        </div>

        <div className={styles.formGroup}>
          <label>URL</label>
          <input type="text" value={url} onChange={handleChange(setUrl)} />
        </div>

        <div className={styles.formGroup}>
          <label>메모</label>
          <textarea value={memo} onChange={handleChange(setMemo)} />
        </div>

        <div className={styles.formGroup}>
          <label>태그</label>
          <CreatableSelect
            isMulti
            value={tags}
            onChange={setTags}
            placeholder="태그를 입력하거나 선택하세요"
          />
        </div>

        <div className={styles.formGroup}>
          <label>카테고리</label>
          <Select
            options={categoryOptions}
            value={category}
            onChange={setCategory}
            placeholder="카테고리를 선택하세요"
          />
        </div>

        <button type="submit" className={styles.submitButton}>
          수정하기
        </button>
      </form>
    </div>
  );
}

export default EditBookmark;
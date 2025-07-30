import { useNavigate } from "react-router-dom";
import axios from "axios";
import { toast } from "react-toastify";
import styles from "../styles/BookmarkCard.module.css";

function BookmarkCard({ id, title, url, memo, onDelete, category, tags = [] }) {
  const navigate = useNavigate();

  const categoryName = category?.name || "기타";
  const categoryColor = category?.color || "#6b7280";

  const handleEdit = () => navigate(`/edit/${id}`);

  const handleDelete = async () => {
    if (!window.confirm("🗑 정말 삭제하시겠습니까?")) return;

    try {
      await axios.delete(`http://localhost:8080/api/bookmarks/${id}`);
      toast.success("삭제 완료!");
      onDelete?.(id);
    } catch (error) {
      console.error("삭제 실패:", error);
      toast.error("삭제에 실패했습니다.");
    }
  };

  return (
    <div className={styles.card}>
      <div className={styles.categoryBadge} style={{ backgroundColor: categoryColor }}>
        {categoryName}
      </div>

      <h3>{title}</h3>
      <a href={url} target="_blank" rel="noopener noreferrer">{url}</a>
      <p>{memo}</p>

      {tags.length > 0 && (
        <div className={styles.tagList}>
          {tags.map((tag) => (
            <span key={tag} className={styles.tagItem}>#{tag}</span>
          ))}
        </div>
      )}

      <div className={styles.actions}>
        <button onClick={handleEdit} className={styles.button}>수정</button>
        <button onClick={handleDelete} className={styles.button}>삭제</button>
      </div>
    </div>
  );
}

export default BookmarkCard;
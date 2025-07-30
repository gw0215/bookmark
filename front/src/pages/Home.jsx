import { useEffect, useState } from "react";
import axios from "axios";
import BookmarkCard from "../components/BookmarkCard";
import styles from "../styles/Home.module.css";
import clsx from "clsx";

function Home() {
  const [bookmarks, setBookmarks] = useState([]);
  const [allTags, setAllTags] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedTag, setSelectedTag] = useState(null);

  useEffect(() => {
    loadBookmarks();
  }, [searchQuery, selectedTag]);

  const loadBookmarks = async () => {
    try {
      const params = new URLSearchParams();
      if (searchQuery) params.append("q", searchQuery);
      if (selectedTag) params.append("tag", selectedTag);

      const endpoint = params.toString()
        ? `http://localhost:8080/api/bookmarks/search?${params.toString()}`
        : `http://localhost:8080/api/bookmarks`;

      const res = await axios.get(endpoint);
      setBookmarks(res.data);
      setAllTags(Array.from(new Set(res.data.flatMap((b) => b.tags || []))));
    } catch (err) {
      console.error("불러오기 실패:", err);
    }
  };

  const handleDelete = (deletedId) => {
    setBookmarks((prev) => prev.filter((b) => b.id !== deletedId));
  };

  return (
    <div className={styles.container}>
      <h1>북마크 목록</h1>

      <div className={styles.header}>
        <input
          type="text"
          placeholder="검색어 입력 (제목, 메모, 태그 등)"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className={styles.searchInput}
        />
        <a href="/add">북마크 추가하기</a>
      </div>

      {allTags.length > 0 && (
        <div className={styles.tagFilter}>
          <strong>태그 필터:</strong>{" "}
          <button
            onClick={() => setSelectedTag(null)}
            className={clsx(styles.tagButton, selectedTag === null && styles.tagButtonActive)}
          >
            전체
          </button>
          {allTags.map((tag) => (
            <button
              key={tag}
              onClick={() => setSelectedTag(tag)}
              className={clsx(styles.tagButton, selectedTag === tag && styles.tagButtonActive)}
            >
              #{tag}
            </button>
          ))}
        </div>
      )}

      {bookmarks.length === 0 ? (
        <p>해당 태그의 북마크가 없습니다.</p>
      ) : (
        bookmarks.map((item) => (
          <BookmarkCard
            key={item.id}
            id={item.id}
            title={item.title}
            url={item.url}
            memo={item.memo}
            category={item.category}
            tags={item.tags}
            onDelete={handleDelete}
          />
        ))
      )}
    </div>
  );
}

export default Home;
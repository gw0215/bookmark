package com.bookmark.bookmark_app.controller;

import com.bookmark.bookmark_app.model.Bookmark;
import com.bookmark.bookmark_app.repository.BookmarkRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Objects;
import java.util.Optional;

@RestController
@RequestMapping("/api/bookmarks")
@RequiredArgsConstructor
public class BookmarkController {

    private final BookmarkRepository repository;

    @GetMapping
    public List<Bookmark> getAll() {
        return repository.findAll();
    }

    @GetMapping("/{id}")
    public ResponseEntity<Bookmark> getById(@PathVariable String id) {
        return repository.findById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @GetMapping("/search")
    public List<Bookmark> search(
            @RequestParam(value = "q", required = false) String q,
            @RequestParam(value = "tag", required = false) String tag
    ) {
        if (q != null && !q.trim().isEmpty()){
            return repository.searchByKeywordAndTag(q, tag);
        } else if (q != null) {
            return repository.searchByKeyword(q);
        } else if (tag != null) {
            return repository.findByTags(tag);
        } else {
            return repository.findAll();
        }
    }

    @PostMapping
    public Bookmark create(@RequestBody Bookmark bookmark) {
        return repository.save(bookmark);
    }

    @DeleteMapping("/{id}")
    public void delete(@PathVariable String id) {
        repository.deleteById(id);
    }


    @PutMapping("/{id}")
    public ResponseEntity<Bookmark> updateBookmark(@PathVariable String id, @RequestBody Bookmark updatedData) {
        Optional<Bookmark> optionalBookmark = repository.findById(id);
        if (optionalBookmark.isEmpty()) {
            return ResponseEntity.notFound().build();
        }

        Bookmark existing = optionalBookmark.get();

        if (updatedData.getMemo() != null && !Objects.equals(existing.getMemo(), updatedData.getMemo())) {
            Bookmark.MemoHistory history = new Bookmark.MemoHistory();
            history.setMemo(existing.getMemo());
            history.setModifiedAt(LocalDateTime.now());
            existing.getMemoHistory().add(history);
            existing.setMemo(updatedData.getMemo());
        }

        existing.setTitle(updatedData.getTitle());
        existing.setUrl(updatedData.getUrl());
        existing.setTags(updatedData.getTags());
        existing.setCategory(updatedData.getCategory());

        Bookmark saved = repository.save(existing);
        return ResponseEntity.ok(saved);
    }

}

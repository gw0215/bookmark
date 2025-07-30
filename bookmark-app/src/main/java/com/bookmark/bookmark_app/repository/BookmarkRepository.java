package com.bookmark.bookmark_app.repository;

import com.bookmark.bookmark_app.model.Bookmark;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.data.mongodb.repository.Query;

import java.util.List;

public interface BookmarkRepository extends MongoRepository<Bookmark, String> {

    @Query("{ '$and': [" +
            "  { '$or': [" +
            "    { 'title': { $regex: ?0, $options: 'i' } }, " +
            "    { 'url': { $regex: ?0, $options: 'i' } }, " +
            "    { 'memo': { $regex: ?0, $options: 'i' } }, " +
            "    { 'tags': { $regex: ?0, $options: 'i' } }" +
            "  ] }," +
            "  { 'tags': ?1 }" +
            "] }")
    List<Bookmark> searchByKeywordAndTag(String keyword, String tag);

    @Query("{ '$or': [" +
            "  { 'title': { $regex: ?0, $options: 'i' } }, " +
            "  { 'url': { $regex: ?0, $options: 'i' } }, " +
            "  { 'memo': { $regex: ?0, $options: 'i' } }, " +
            "  { 'tags': { $regex: ?0, $options: 'i' } }" +
            "] }")
    List<Bookmark> searchByKeyword(String keyword);

    List<Bookmark> findByTags(String tag);

}

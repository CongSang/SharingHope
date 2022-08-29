/*
 * Click nbfs://nbhost/SystemFileSystem/Templates/Licenses/license-default.txt to change this license
 * Click nbfs://nbhost/SystemFileSystem/Templates/Classes/Interface.java to edit this template
 */
package com.charitysm.services;

import com.charitysm.pojo.Comment;
import com.charitysm.pojo.User;
import com.charitysm.pojo.reobj.CommentRequest;
import java.math.BigInteger;
import java.util.List;

/**
 *
 * @author ADMIN
 */
public interface CommentService {
    Comment createComment(CommentRequest cq, User u);
    void deleteComment(int id, String userId);
    List<Comment> getComments(int postId, int page);
    Comment getCommentById(int id);
    BigInteger getCommentCount(int postId);
    List<Comment> getReplies(int commentId, int page);
    long countCommentStats(int month, int year);
    Comment editComment(CommentRequest req, int commentId);
}

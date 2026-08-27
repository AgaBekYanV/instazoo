package com.my.instazoo.service;

import com.my.instazoo.dto.PostDTO;
import com.my.instazoo.entity.ImageModel;
import com.my.instazoo.entity.Post;
import com.my.instazoo.entity.User;
import com.my.instazoo.exception.PostNotFoundException;
import com.my.instazoo.repository.ImageModelRepository;
import com.my.instazoo.repository.PostRepository;
import com.my.instazoo.repository.UserRepository;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

import java.security.Principal;
import java.util.List;
import java.util.Optional;

@Service
@Slf4j
public class PostService {

    private final PostRepository postRepository;
    private final UserRepository userRepository;
    private final ImageModelRepository imageModelRepository;

    @Autowired
    public PostService(PostRepository postRepository,
                       UserRepository userRepository,
                       ImageModelRepository imageModelRepository) {
        this.postRepository = postRepository;
        this.userRepository = userRepository;
        this.imageModelRepository = imageModelRepository;
    }

    public Post createPost(PostDTO postDTO, Principal principal) {
        User user = getUserByPrincipal(principal);
        Post post = new Post();
        post.setUser(user);
        post.setCaption(postDTO.getCaption());
        post.setLocation(postDTO.getLocation());
        post.setTitle(postDTO.getTitle());
        post.setLikes(0);

        log.info("Saving Post for User: {}", user.getEmail());
        return postRepository.save(post);
    }

    public List<Post> getAllPosts() {
        return postRepository.findAllByOrderByCreatedDateDesc();
    }

    public Post getPostById(Long postId, Principal principal) {
        User user = getUserByPrincipal(principal);
        return postRepository.findPostByIdAndUser(postId, user)
                .orElseThrow(() -> new PostNotFoundException("Post cannot be found for username: " + user.getEmail()));
    }

    public List<Post> getAllPostForUser(Principal principal) {
        User user = getUserByPrincipal(principal);
        return postRepository.findAllByUserOrderByCreatedDateDesc(user);
    }

    public Post likePost(Long postId, String username) {
        Post post = postRepository.findById(postId)
                .orElseThrow(() -> new PostNotFoundException("Post cannot be found"));

        Optional<String> userLiked = post.getLikedUsers()
                .stream()
                .filter(u -> u.equals(username)).findAny();

        if (userLiked.isPresent()) {
            post.setLikes(post.getLikes() - 1);
            post.getLikedUsers().remove(username);
        } else {
            post.setLikes(post.getLikes() + 1);
            post.getLikedUsers().add(username);
        }
        return postRepository.save(post);
    }

    public void deletePost(Long postId, Principal principal) {
        Post post = getPostById(postId, principal);
        Optional<ImageModel> imageModel = imageModelRepository.findByPostId(post.getId());
        postRepository.delete(post);
        imageModel.ifPresent(imageModelRepository::delete);
    }

    private User getUserByPrincipal(Principal principal) {
        String username = principal.getName();
        return userRepository.findUserByUsername(username)
                .orElseThrow(() -> new UsernameNotFoundException("Username not found with username: " + username));
    }
}

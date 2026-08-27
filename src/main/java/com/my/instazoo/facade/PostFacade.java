package com.my.instazoo.facade;

import com.my.instazoo.dto.PostDTO;
import com.my.instazoo.entity.Post;
import org.springframework.stereotype.Component;

@Component
public class PostFacade {

    public PostDTO postToPostDTO(Post post){
        PostDTO postDTO = new PostDTO();
        postDTO.setId(post.getId());
        postDTO.setTitle(post.getTitle());
        postDTO.setCaption(post.getCaption());
        postDTO.setLocation(post.getLocation());
        postDTO.setUsername(post.getUser().getUsername());
        postDTO.setLikes(post.getLikes());
        postDTO.setUsersLiked(post.getLikedUsers());

        return postDTO;
    }
}

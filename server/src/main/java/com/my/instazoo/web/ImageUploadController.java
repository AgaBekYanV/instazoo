package com.my.instazoo.web;

import com.my.instazoo.entity.ImageModel;
import com.my.instazoo.payload.response.MessageResponse;
import com.my.instazoo.service.ImageUploadService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.security.Principal;

@RestController
@RequestMapping("/api/image")
@CrossOrigin
public class ImageUploadController {

    @Autowired
    private ImageUploadService  imageUploadService;

    @PostMapping("/upload")
    public ResponseEntity<MessageResponse> uploadImageToUser(@RequestParam("file")MultipartFile file,
                                                             Principal principal) throws IOException {
        imageUploadService.uploadImageToUser(file, principal);
        return  ResponseEntity.ok(new MessageResponse("Image uploaded successfully to User"));
    }

    @PostMapping("/{postId}/upload")
    public ResponseEntity<MessageResponse> uploadImageToPost(@PathVariable("postId") String postId,
                                                             @RequestParam("file") MultipartFile file,
                                                             Principal principal) throws IOException {
        imageUploadService.uploadImageToPost(file,principal,Long.parseLong(postId));
        return ResponseEntity.ok(new MessageResponse("Image uploaded successfully to Post"));
    }

    @GetMapping("/profileImage")
    public ResponseEntity<ImageModel> getImageForUser(Principal principal){
        ImageModel userImage = imageUploadService.getImageToUser(principal);
        return new ResponseEntity<>(userImage, HttpStatus.OK);
    }

    @GetMapping("/{postId}/image")
    public ResponseEntity<ImageModel> getImageFotPost(@PathVariable("postId") String postId){
        ImageModel imageModel = imageUploadService.getImageToPost(Long.parseLong(postId));
        return  new ResponseEntity<>(imageModel, HttpStatus.OK);
    }
}

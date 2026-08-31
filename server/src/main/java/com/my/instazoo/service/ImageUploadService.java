package com.my.instazoo.service;

import com.my.instazoo.entity.ImageModel;
import com.my.instazoo.entity.Post;
import com.my.instazoo.entity.User;
import com.my.instazoo.exception.ImageNotFoundException;
import com.my.instazoo.repository.CommentRepository;
import com.my.instazoo.repository.ImageModelRepository;
import com.my.instazoo.repository.UserRepository;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;
import org.springframework.util.ObjectUtils;
import org.springframework.web.multipart.MultipartFile;

import java.io.ByteArrayOutputStream;
import java.io.IOException;
import java.security.Principal;
import java.util.stream.Collector;
import java.util.stream.Collectors;
import java.util.zip.DataFormatException;
import java.util.zip.Deflater;
import java.util.zip.Inflater;

@Service
@Slf4j
public class ImageUploadService {

    private final ImageModelRepository imageModelRepository;
    private final UserRepository userRepository;
    private final CommentRepository commentRepository;

    @Autowired
    public ImageUploadService(ImageModelRepository imageModelRepository,
                              UserRepository userRepository,
                              CommentRepository commentRepository) {
        this.imageModelRepository = imageModelRepository;
        this.userRepository = userRepository;
        this.commentRepository = commentRepository;
    }

    public ImageModel uploadImageToUser(MultipartFile file, Principal principal) throws IOException{
        User user = getUserByPrincipal(principal);
        log.info("Uploading image profile to User {}:",  user.getUsername());

        ImageModel userProfileImage = imageModelRepository.findByUserId(user.getId()).orElse(null);
        if(!ObjectUtils.isEmpty(userProfileImage)){
            imageModelRepository.delete(userProfileImage);
        }

        ImageModel imageModel = new ImageModel();
        imageModel.setUserId(user.getId());
        imageModel.setImageBytes(compressBytes(file.getBytes()));
        imageModel.setName(file.getOriginalFilename());
        return imageModelRepository.save(imageModel);
    }

    public ImageModel uploadImageToPost(MultipartFile file, Principal principal, Long postId) throws IOException{
        User user = getUserByPrincipal(principal);
        Post post = user.getPosts()
                        .stream()
                        .filter(p -> p.getId().equals(postId))
                        .collect(toSinglePostCollector());

        ImageModel imageModel = new ImageModel();
        imageModel.setPostId(post.getId());
        imageModel.setImageBytes(compressBytes(file.getBytes()));
        imageModel.setName(file.getOriginalFilename());
        imageModel.setUserId(user.getId());
        log.info("Uploading image to Post {}:", post.getId() );
        return imageModelRepository.save(imageModel);
    }

    public ImageModel getImageToUser(Principal principal){
        User user = getUserByPrincipal(principal);
        ImageModel userProfileImage = imageModelRepository.findByUserId(user.getId()).orElse(null);
        if(!ObjectUtils.isEmpty(userProfileImage)){
            userProfileImage.setImageBytes(decompressBytes(userProfileImage.getImageBytes()));
        }
        return userProfileImage;
    }

    public ImageModel getImageToPost(Long postId){
        ImageModel imageModel = imageModelRepository.findByPostId(postId)
                .orElseThrow(() -> new ImageNotFoundException("Cannot find image to Post: " + postId));
        if(!ObjectUtils.isEmpty(imageModel)){
            imageModel.setImageBytes(decompressBytes(imageModel.getImageBytes()));
        }

        return imageModel;
    }


    private byte[] compressBytes(byte[] data){
        if (data == null || data.length == 0) {
            return new byte[0];
        }
        Deflater deflater = new Deflater();
        deflater.setInput(data);
        deflater.finish();
        ByteArrayOutputStream outputStream = new ByteArrayOutputStream(data.length);
        byte[] buffer = new byte[1024];
        while (!deflater.finished()) {
            int count = deflater.deflate(buffer);
            outputStream.write(buffer,0,count);
        }
        try{
            outputStream.close();
        } catch (IOException e){
            log.error("Cannot compress Bytes");
        }finally {
            deflater.end();
        }
        System.out.println("Compressed Image Byte Size - " + outputStream.toByteArray().length);
        return outputStream.toByteArray();
    }

    private static byte[] decompressBytes(byte[] data){
        if (data == null || data.length == 0) {
            return new byte[0];
        }
        Inflater inflater = new Inflater();
        inflater.setInput(data);
        ByteArrayOutputStream outputStream = new ByteArrayOutputStream(data.length);
        byte[] buffer = new byte[1024];
        try{
            while (!inflater.finished()) {
                int count = inflater.inflate(buffer);
                if (count == 0) {
                    if (inflater.needsInput()) {
                        break;
                    }
                }
                outputStream.write(buffer,0,count);
            }
            outputStream.close();
        } catch (IOException | DataFormatException e){
            log.error("Cannot decompress Bytes");
        } finally {
            inflater.end();
        }

        System.out.println("Decompressed Image Byte Size - " + outputStream.toByteArray().length);
        return outputStream.toByteArray();
    }

    private User getUserByPrincipal(Principal principal) {
        String username = principal.getName();
        return userRepository.findUserByUsername(username)
                .orElseThrow(() -> new UsernameNotFoundException("Username not found with username: " + username));
    }

        private <T> Collector<T,?,T> toSinglePostCollector(){
        return Collectors.collectingAndThen(
                Collectors.toList(),
                list -> {
                    if(list.size() != 1){
                        throw new IllegalStateException();
                    }
                    return list.get(0);
                }
        );
    }
}

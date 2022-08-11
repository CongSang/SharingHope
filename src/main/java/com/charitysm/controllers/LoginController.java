package com.charitysm.controllers;

import com.charitysm.pojo.User;
import com.charitysm.pojo.reobj.FileUploadResponse;
import com.charitysm.services.UserService;
import com.cloudinary.Cloudinary;
import com.cloudinary.utils.ObjectUtils;
import org.springframework.beans.factory.annotation.Autowired;
import java.io.IOException;
import java.util.Date;
import java.util.Map;
import java.util.UUID;
import java.util.logging.Level;
import java.util.logging.Logger;
import javax.servlet.http.HttpServletResponse;
import javax.servlet.http.HttpSession;
import javax.validation.Valid;
import org.springframework.security.authentication.AnonymousAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.validation.BindingResult;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.ModelAttribute;
import org.springframework.web.bind.annotation.PostMapping;

/**
 *
 * @author CÔNG SANG
 */
@Controller
public class LoginController {
    
    @Autowired
    private Cloudinary cloudinary;
    @Autowired
    private UserService userService;
    @Autowired
    private BCryptPasswordEncoder passwordEncoder;

    @GetMapping("/login")
    public String login(Model model) {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();

        if (authentication == null || authentication instanceof AnonymousAuthenticationToken) {
            return "login";
        }

        return "redirect:/";
    }

    @GetMapping("/register")
    public String register(Model model) {
        User user = new User();
        model.addAttribute("user", user);

        return "register";
    }

    @PostMapping("/register")
    public String submitRegister(@ModelAttribute(value = "user") @Valid User user,
            BindingResult bindingResult) {
        if (bindingResult.hasErrors()) {
            System.out.println(bindingResult);
            return "register";
        } else {
            FileUploadResponse res = new FileUploadResponse();
            String uniqueID = UUID.randomUUID().toString();
            String passEncode = passwordEncoder.encode(user.getPassword());
            try {
                Map rs = cloudinary.uploader().upload(user.getFile().getBytes(),
                        ObjectUtils.asMap("resource_type", "auto"));

                res.setFileName("fileName");
                res.setUrl((String) rs.get("secure_url") + "?public_id=" + rs.get("public_id"));
                res.setSize(12);
            } catch (IOException ex) {
                Logger.getLogger(ApiPostController.class.getName()).log(Level.SEVERE, null, ex);
            }
            
            user.setPassword(passEncode);
            user.setId(uniqueID);
            user.setActive((short)1);
            user.setCreatedDate(new Date());
            user.setAvatar(res.getUrl());
            user.setUserRole("ROLE_USER");
            
            this.userService.registerNewUser(user);

            return "redirect:/login";
        }
    }

    @GetMapping("/logout")
    public void logout(HttpSession session, HttpServletResponse response) throws IOException {
        session.removeAttribute("currentUser");
        response.sendRedirect("login");
    }
}

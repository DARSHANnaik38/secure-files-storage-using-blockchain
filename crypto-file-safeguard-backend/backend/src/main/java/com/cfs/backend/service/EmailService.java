package com.cfs.backend.service;

import com.cfs.backend.dto.ContactRequest;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.stereotype.Service;

@Service
public class EmailService {

    private final JavaMailSender mailSender;

    public EmailService(JavaMailSender mailSender) {
        this.mailSender = mailSender;
    }

    public void sendContactEmail(ContactRequest contactRequest) {
        SimpleMailMessage message = new SimpleMailMessage();
        message.setFrom(contactRequest.getEmail());
        message.setTo("contact.darshannaik@gmail.com"); // Your destination email
        message.setSubject("New Contact Form Submission: " + contactRequest.getSubject());

        String emailBody = "You have a new message from: " + contactRequest.getName() + " (" + contactRequest.getEmail() + ")\n\n"
                + "Message:\n" + contactRequest.getMessage();
        message.setText(emailBody);

        mailSender.send(message);
    }
}
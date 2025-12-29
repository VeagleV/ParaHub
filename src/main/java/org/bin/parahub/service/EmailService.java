package org.bin.parahub.service;

import lombok.RequiredArgsConstructor;
import org.bin.parahub.annotation.Profiled;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.scheduling.annotation.Async;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
@Profiled(logArgs = true, logResult = false)
public class EmailService {
    private final JavaMailSender mailSender;

    @Async
    public void sendVerificationCode(String to, String code) {
        SimpleMailMessage message = new SimpleMailMessage();
        message.setTo(to);
        message.setSubject("Код подтверждения ParaHub");
        message.setText("Ваш код подтверждения: " + code + "\n\nКод действителен 5 минут.");
        message.setFrom("kitnikit2005@gmail.com");  // Уточни отправителя (здесь твой username)
        mailSender.send(message);
    }
}
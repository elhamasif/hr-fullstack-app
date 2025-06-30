import { Injectable } from '@nestjs/common';
import * as nodemailer from 'nodemailer';

@Injectable()
export class MailService {
  private transporter = nodemailer.createTransport({
    service: 'gmail', // or any SMTP service
    auth: {
      user: 'sadikelham69@gmail.com',
      pass: 'afzi xlwz sebh qedk', // Use an App Password if using Gmail
    },
  });


  async sendMail(to: string, subject: string, text: string) {
    const mailOptions = {
      from: '"NestMailer" <sadikelham69@gmail.com>',
      to,
      subject,
      text,
    };

    try {
      const info = await this.transporter.sendMail(mailOptions);
      console.log('Email sent: ' + info.response);
      return info;
    } catch (error) {
      console.error('Error sending email:', error);
      throw error;
    }
  }
  async sendPasswordResetEmail(to: string, resetLink: string) {
    const subject = 'Reset Your Password';
    const text = `Click the following link to reset your password:\n${resetLink}`;
    return this.sendMail(to, subject, text);
  }
}
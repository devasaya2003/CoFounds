import nodemailer from "nodemailer";

export async function sendVerificationEmail(
  email: string,
  nameOfCandidate: string
) {
  try {
    const transport = nodemailer.createTransport({
      host: process.env.HOST,
      port: 465,
      secure: true,
      auth: {
        user: process.env.GOOGLE_USER,
        pass: process.env.GOOGLE_PASSWORD,
      },
    });

    const mailOptions = {
      from: process.env.FROM_EMAIL,
      to: email,
      subject: "Welcome to the Future of Hiring with CoFounds 🚀",
      html: `
        <div style="font-family: Arial, sans-serif; line-height: 1.5; color: #333;">
          <p>Hi ${nameOfCandidate},</p>
          <p>Thank you for joining our waitlist. We're thrilled to have you join us as we revolutionize the hiring process.</p>
          <p>Let me share why we created CoFounds. We've seen how traditional job hunting has become overwhelming, with companies like Plum receiving over 8,500 applications in just four days for a single position. Talented candidates and companies are struggling in this chaos.</p>
          <p>CoFounds is different. We're not just another job board – we're building a platform where your true potential can shine.</p>
          <p>Here's how:</p>
          <ul>
            <li><strong>Through Proof of Work:</strong> Showcase your actual projects, code, and designs instead of just listing skills.</li>
            <li><strong>With Proof of Community:</strong> Highlight your field engagement, mentoring, and collaborative efforts.</li>
          </ul>
          <p>This approach helps you stand out meaningfully while making it easier for companies to spot exceptional talent like you.</p>
          <p>Stay tuned for our launch. We're building something special that will transform how you connect with opportunities that truly match your potential.</p>
          <p>Best Regards,</p>
          <p>Harshit Mahajan<br />Founder, CoFounds</p>
        </div>
      `,
    };

    await transport.sendMail(mailOptions);
  } catch (error) {
    return error;
  }
}

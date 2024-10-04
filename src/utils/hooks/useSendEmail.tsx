import axios from 'axios';
import { useMutation } from 'react-query';
import type { PostDataForEmail } from '../../interfaces';

interface EmailPayload {
	to: { email: string, name: string }[];
	sender: { email: string, name: string };
	subject: string;
	htmlContent: string;
}

const emailTemplate = (username: string, post: PostDataForEmail) => `
  <html>
  <head>
    <style>
      body {
        font-family: Arial, sans-serif;
        background-color: #f4f4f4;
        padding: 0;
        margin: 0;
      }
      .container {
        max-width: 600px;
        margin: 20px auto;
        padding: 20px;
        background-color: #fff;
        border-radius: 8px;
        box-shadow: 0 2px 10px rgba(0,0,0,0.1);
      }
      h1 {
        color: #333;
        border-bottom: 2px solid #eee;
        padding-bottom: 10px;
      }
      p {
        font-size: 16px;
        color: #555;
        line-height: 1.6;
      }
      .cta-button {
        display: inline-block;
        background-color: #007bff;
        color: #ffffff;
        text-decoration: none;
        padding: 10px 20px;
        border-radius: 5px;
        margin-top: 20px;
      }
      .footer {
        margin-top: 20px;
        font-size: 14px;
        color: #777;
        border-top: 1px solid #eee;
        padding-top: 10px;
      }
      .post-details {
        background-color: #f9f9f9;
        padding: 15px;
        border-radius: 5px;
        margin-top: 20px;
      }
      .community-info {
        background-color: #e9f7ff;
        padding: 15px;
        border-radius: 5px;
        margin-top: 20px;
      }
    </style>
  </head>
  <body>
    <div class="container">
      <h1>New Post Alert!</h1>
      <p>Hello ${username},</p>
      <p>We're excited to inform you that a new post has been added to our Pradeep Blog community. Don't miss out on the latest discussions and insights!</p>
      <div class="post-details">
        <h2>${post.title}</h2>
        <p><strong>Author:</strong> ${post.author}</p>
        <p><strong>Summary:</strong> ${post.description}</p>
      </div>
      <p>Head over to our platform to check it out and join the conversation.</p>
      <a href="${post.link}" class="cta-button">View New Post</a>
      <p>Your engagement makes our community thrive. We can't wait to hear your thoughts!</p>
      <div class="community-info">
        <h3>About Pradeep Blog Community</h3>
        <p>Pradeep Blog is a vibrant community of tech enthusiasts, developers, and innovators. Here's what makes us special:</p>
        <ul>
          <li>Diverse topics covering the latest in technology, programming, and digital trends</li>
          <li>Expert contributors sharing in-depth knowledge and practical insights</li>
          <li>Interactive discussions and networking opportunities with like-minded professionals</li>
          <li>Regular updates on industry news, best practices, and cutting-edge technologies</li>
          <li>A supportive environment for both beginners and seasoned professionals to learn and grow</li>
        </ul>
        <p>Join us in shaping the future of technology through meaningful conversations and collaborative learning!</p>
      </div>
      <p>Best regards,<br/>The Pradeep Blog Community Team</p>
      <div class="footer">
        <p>If you prefer not to receive these notifications, you can update your preferences in your account settings.</p>
      </div>
    </div>
  </body>
  </html>
`;

export const useSendEmail = () => {
	return useMutation({
		mutationFn: async (data: { users: { Email: string, Username: string }[], post: PostDataForEmail }) => {
			const sender = { email: 'rowdypradeep007@gmail.com', name: 'Pradeep' };

			const emailPromises = data.users.map(async (user) => {
				const emailData: EmailPayload = {
					sender,
					to: [{ email: user.Email, name: user.Username }],
					subject: 'New Post in Pradeep Blog',
					htmlContent: emailTemplate(user.Username, data.post),
				};

				const response = await axios.post('https://api.brevo.com/v3/smtp/email', emailData, {
					headers: {
						'api-key': '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',
						'Content-Type': 'application/json',
					},
				});
				console.log(response);
			});

			await Promise.all(emailPromises);
		},
	});
};

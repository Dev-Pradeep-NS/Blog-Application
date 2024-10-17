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
        transition: background-color 0.3s ease;
      }
      .cta-button:hover {
        background-color: #0056b3;
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
      .post-image {
        max-width: 100%;
        height: auto;
        border-radius: 5px;
        margin-top: 15px;
      }
      .highlight {
        background-color: #fffacd;
        padding: 2px 5px;
        border-radius: 3px;
      }
    </style>
  </head>
  <body>
    <div class="container">
      <h1>🎉 New Post Alert! 🎉</h1>
      <p>Hello <span class="highlight">${username}</span>,</p>
      <p>We're thrilled to inform you that a new post has been added to our Specwise Blogs community. Get ready for some fresh insights and engaging discussions!</p>
      <div class="post-details">
        <h2>${post.title}</h2>
        <p><strong>Author:</strong> ${post.author}</p>
        <p><strong>Summary:</strong> ${post.description}</p>
        ${post.image ? `<img src="${post.image}" alt="Post Image" class="post-image">` : ''}
      </div>
      <p>Don't miss out on this exciting new content. Head over to our platform to dive in and share your thoughts!</p>
      <a href="${post.link}" class="cta-button">Read Full Post</a>
      <p>Your engagement is what makes our community thrive. We can't wait to hear your perspective!</p>
      <div class="community-info">
        <h3>🌟 About Specwise Blogs Community</h3>
        <p>Specwise Blogs is a vibrant hub for tech enthusiasts, developers, and innovators. Here's what makes us special:</p>
        <ul>
          <li>🔍 Diverse topics covering the latest in technology, programming, and digital trends</li>
          <li>👨‍🏫 Expert contributors sharing in-depth knowledge and practical insights</li>
          <li>💬 Interactive discussions and networking opportunities with like-minded professionals</li>
          <li>📰 Regular updates on industry news, best practices, and cutting-edge technologies</li>
          <li>🌱 A supportive environment for both beginners and seasoned professionals to learn and grow</li>
        </ul>
        <p>Join us in shaping the future of technology through meaningful conversations and collaborative learning!</p>
      </div>
      <p>Best regards,<br/>The Specwise Blogs Community Team</p>
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
			const email = process.env.REACT_APP_BREVO_EMAIL;
			const name = process.env.REACT_APP_BREVO_NAME;
			const api_key = process.env.REACT_APP_BREVO_API_KEY;

			const sender = { email: `${email}`, name: `${name}` };

			const emailPromises = data.users.map(async (user) => {
				const emailData: EmailPayload = {
					sender,
					to: [{ email: user.Email, name: user.Username }],
					subject: 'New Post in Specwise Blogs',
					htmlContent: emailTemplate(user.Username, data.post),
				};

				const response = await axios.post('https://api.brevo.com/v3/smtp/email', emailData, {
					headers: {
						'api-key': `${api_key}`,
						'Content-Type': 'application/json',
					},
				});
				console.log(response);
			});

			await Promise.all(emailPromises);
		},
	});
};

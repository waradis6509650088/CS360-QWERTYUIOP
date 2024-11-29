import React, { useState, useContext } from 'react';
import { useRouter } from 'next/router';
import { AuthContext } from '../../../../context/AuthContext';

export default function WriteArticle() {
  const { user } = useContext(AuthContext);
  const router = useRouter();

  // Basic article info
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [category, setCategory] = useState('');
  const [image, setImage] = useState(null);
  const [previewUrl, setPreviewUrl] = useState('');

  // SEO fields
  const [metaTitle, setMetaTitle] = useState('');
  const [metaDescription, setMetaDescription] = useState('');
  const [keywords, setKeywords] = useState('');

  // Related Articles
  const [relatedArticles, setRelatedArticles] = useState([]);

  // FAQ section
  const [faqs, setFaqs] = useState([{ question: '', answer: '' }]);

  // Command Line CTA
  const [ctaTitle, setCtaTitle] = useState('');
  const [ctaText, setCtaText] = useState('');
  const [commandLine, setCommandLine] = useState('');

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImage(file);
      setPreviewUrl(URL.createObjectURL(file));
    }
  };

  const handleFaqChange = (index, field, value) => {
    const newFaqs = [...faqs];
    newFaqs[index][field] = value;
    setFaqs(newFaqs);
  };

  const addFaq = () => {
    setFaqs([...faqs, { question: '', answer: '' }]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      // Upload image
      let imageId = null;
      if (image) {
        const formData = new FormData();
        formData.append('files', image);
        const uploadRes = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/api/upload`,
          {
            method: 'POST',
            headers: {
              Authorization: `Bearer ${localStorage.getItem('token')}`,
            },
            body: formData,
          }
        );

        if (!uploadRes.ok) throw new Error('Image upload failed');
        const uploadData = await uploadRes.json();
        imageId = uploadData[0].id;
      }

      // Create article with all fields
      const articleData = {
        data: {
          title,
          ckeditor_content: content,
          category,
          image: imageId,
          author: user.id,
          slug: title.toLowerCase().replace(/ /g, '-'),
          locale: 'en',
          blocks: [
            // FAQ Block
            {
              __component: 'blocks.faq',
              title: 'Frequently Asked Questions',
              theme: 'primary',
              faq: faqs,
            },
            // CTA Command Line Block
            {
              __component: 'blocks.cta-command-line',
              title: ctaTitle,
              text: ctaText,
              theme: 'primary',
              commandLine: commandLine,
            },
          ],
          seo: {
            metaTitle,
            metaDescription,
            keywords,
            metaRobots: 'index, follow',
            structuredData: JSON.stringify({
              '@context': 'https://schema.org',
              '@type': 'Article',
              headline: metaTitle,
              description: metaDescription,
              author: {
                '@type': 'Person',
                name: user.username,
              },
            }),
          },
        },
      };

      const articleRes = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/articles`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${localStorage.getItem('token')}`,
          },
          body: JSON.stringify(articleData),
        }
      );

      if (!articleRes.ok) throw new Error('Failed to create article');

      router.push('/blog');
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  if (!user) {
    return (
      <div className="flex justify-center items-center h-screen">
        <p className="text-lg text-gray-600">Please login to write articles</p>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto p-6">
      <h1 className="text-3xl font-bold mb-8 text-gray-800">
        Write New Article
      </h1>

      {error && (
        <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 mb-6">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Basic Article Information */}
        <section className="space-y-6 border-b pb-6">
          <h2 className="text-xl font-semibold">Basic Information</h2>

          <div>
            <label className="block text-gray-700 text-sm font-bold mb-2">
              Title
            </label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
              required
            />
          </div>

          <div>
            <label className="block text-gray-700 text-sm font-bold mb-2">
              Category
            </label>
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
              required
            >
              <option value="">Select a category</option>
              <option value="5">American</option>
              <option value="13">Chinese</option>
              <option value="12">Dinner Bar</option>
              <option value="4">European</option>
              <option value="11">French</option>
              <option value="3">International</option>
              <option value="10">Lebanese</option>
              <option value="6">Michelin</option>
              <option value="9">Russian</option>
              <option value="8">Vietnamese</option>
            </select>
          </div>

          <div>
            <label className="block text-gray-700 text-sm font-bold mb-2">
              Content
            </label>
            <textarea
              value={content}
              onChange={(e) => setContent(e.target.value)}
              className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary h-64"
              required
            />
          </div>

          <div>
            <label className="block text-gray-700 text-sm font-bold mb-2">
              Featured Image
            </label>
            <input
              type="file"
              accept="image/*"
              onChange={handleImageChange}
              className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
              required
            />
            {previewUrl && (
              <img
                src={previewUrl}
                alt="Preview"
                className="mt-4 max-w-md rounded-lg shadow-lg"
              />
            )}
          </div>
        </section>

        {/* SEO Section */}
        <section className="space-y-6 border-b pb-6">
          <h2 className="text-xl font-semibold">SEO Information</h2>

          <div>
            <label className="block text-gray-700 text-sm font-bold mb-2">
              Meta Title
            </label>
            <input
              type="text"
              value={metaTitle}
              onChange={(e) => setMetaTitle(e.target.value)}
              className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
              maxLength={60}
              required
            />
          </div>

          <div>
            <label className="block text-gray-700 text-sm font-bold mb-2">
              Meta Description
            </label>
            <textarea
              value={metaDescription}
              onChange={(e) => setMetaDescription(e.target.value)}
              className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
              maxLength={160}
              required
            />
          </div>

          <div>
            <label className="block text-gray-700 text-sm font-bold mb-2">
              Keywords (comma separated)
            </label>
            <input
              type="text"
              value={keywords}
              onChange={(e) => setKeywords(e.target.value)}
              className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
            />
          </div>
        </section>

        {/* FAQ Section */}
        <section className="space-y-6 border-b pb-6">
          <h2 className="text-xl font-semibold">FAQs</h2>

          {faqs.map((faq, index) => (
            <div key={index} className="space-y-4">
              <div>
                <label className="block text-gray-700 text-sm font-bold mb-2">
                  Question {index + 1}
                </label>
                <input
                  type="text"
                  value={faq.question}
                  onChange={(e) =>
                    handleFaqChange(index, 'question', e.target.value)
                  }
                  className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                />
              </div>
              <div>
                <label className="block text-gray-700 text-sm font-bold mb-2">
                  Answer
                </label>
                <textarea
                  value={faq.answer}
                  onChange={(e) =>
                    handleFaqChange(index, 'answer', e.target.value)
                  }
                  className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                />
              </div>
            </div>
          ))}

          <button
            type="button"
            onClick={addFaq}
            className="text-primary hover:text-primary-dark font-semibold"
          >
            + Add Another FAQ
          </button>
        </section>

        {/* CTA Command Line Section */}
        <section className="space-y-6 border-b pb-6">
          <h2 className="text-xl font-semibold">Command Line CTA</h2>

          <div>
            <label className="block text-gray-700 text-sm font-bold mb-2">
              CTA Title
            </label>
            <input
              type="text"
              value={ctaTitle}
              onChange={(e) => setCtaTitle(e.target.value)}
              className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
            />
          </div>

          <div>
            <label className="block text-gray-700 text-sm font-bold mb-2">
              CTA Text
            </label>
            <input
              type="text"
              value={ctaText}
              onChange={(e) => setCtaText(e.target.value)}
              className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
            />
          </div>

          <div>
            <label className="block text-gray-700 text-sm font-bold mb-2">
              Command Line
            </label>
            <input
              type="text"
              value={commandLine}
              onChange={(e) => setCommandLine(e.target.value)}
              className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary font-mono"
              placeholder="npm install your-package"
            />
          </div>
        </section>

        {/* Related Articles Section */}
        <section className="space-y-6">
          <h2 className="text-xl font-semibold">Related Articles</h2>

          <div>
            <label className="block text-gray-700 text-sm font-bold mb-2">
              Related Articles Header
            </label>
            <input
              type="text"
              className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
              placeholder="You might also like..."
            />
          </div>

          {/* Submit Button */}
          <div className="mt-8">
            <button
              type="submit"
              disabled={loading}
              className={`w-full bg-primary text-white font-bold py-3 px-4 rounded-lg hover:bg-primary-dark transition-colors 
                ${loading ? 'opacity-50 cursor-not-allowed' : ''}`}
            >
              {loading ? 'Publishing...' : 'Publish Article'}
            </button>
          </div>
        </section>
      </form>
    </div>
  );
}

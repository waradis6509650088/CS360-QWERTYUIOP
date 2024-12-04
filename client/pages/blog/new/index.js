import Layout from '../../../components/layout';
import WriteArticle from '../../../components/pages/blog/WriteArticle';
import Container from '../../../components/shared/Container';
import { AuthContext } from '../../../context/AuthContext';
import { useContext } from 'react';
import { useRouter } from 'next/router';
import ProtectedRoute from '../../../components/ProtectedRoute';

export default function NewArticle({ global }) {
  return (
    <ProtectedRoute>
      <Layout global={global}>
        <Container>
          <WriteArticle />
        </Container>
      </Layout>
    </ProtectedRoute>
  );
}

export async function getServerSideProps(context) {
  try {
    // Reuse existing global props logic
    return {
      props: {
        global: {}, // Add your global props here
      },
    };
  } catch (error) {
    return {
      redirect: {
        destination: '/',
        permanent: false,
      },
    };
  }
}
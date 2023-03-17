import { NextPage, GetStaticProps, GetStaticPaths, InferGetStaticPropsType } from "next";
import path from "path";
import fs from "fs";
import matter from "gray-matter";
import { ParsedUrlQueryInput } from "querystring";
import { MDXRemote, MDXRemoteSerializeResult } from "next-mdx-remote";
import { serialize } from "next-mdx-remote/serialize";

type Props = InferGetStaticPropsType<typeof getStaticProps>

const SinglePage: NextPage<Props> = ({post}) => {
  const { title, content } = post;
  return (
    <div className="max-w-3xl mx-auto">
      <h1 className="font-semibold text-2xl py-5">{title}</h1>
      <div className="prose pb-20">
        <MDXRemote {...content} />
      </div>
    </div>
  );
}

export const getStaticPaths: GetStaticPaths = () => {
  const dirPathToRead = path.join(process.cwd(), 'posts');
  const dirs = fs.readdirSync(dirPathToRead);
  const paths = dirs.map(filename => {
    const filePathToRead = path.join(process.cwd(), 'posts/' + filename);
    const fileContent = fs.readFileSync(filePathToRead, {encoding: 'utf-8'});
    return { params: { postSlug: matter(fileContent).data.slug } };
  });
  return {
    paths,
    fallback: "blocking",
  };
};

interface IStaticProps extends ParsedUrlQueryInput {
  postSlug: string;
}

type Post = {
  post: {
    title: string;
    content: MDXRemoteSerializeResult;
  }
}

export const getStaticProps: GetStaticProps<Post> = async (context) => {
  try {
    const { params } = context;
    const { postSlug } = params as IStaticProps;
    const filePathToRead = path.join(process.cwd(), 'posts/' + postSlug + ".md");
    const fileContent = fs.readFileSync(filePathToRead, {encoding: 'utf-8'});
    // const { content, data } = matter(fileContent);
    const source: any = await serialize(fileContent, { parseFrontmatter: true });

    return {
      props: {
        post: {
          content: source,
          title: source.frontmatter.title,
        }
      }
    };
  } catch (e) {
    return {
      notFound: true
    }
  }
};

export default SinglePage;
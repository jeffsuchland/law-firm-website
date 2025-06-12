/// <reference types="astro/client" />
import { createClient, Entry, EntryCollection, Asset } from 'contentful';

const client = createClient({
  space: import.meta.env.CONTENTFUL_SPACE_ID,
  accessToken: import.meta.env.CONTENTFUL_ACCESS_TOKEN,
});

type ContentfulAuthorFields = {
  name: string;
  title: string;
  image: Asset;
}

type ContentfulBlogPostFields = {
  title: string;
  slug: string;
  publishDate: string;
  featuredImage: Asset;
  excerpt: string;
  content: {
    nodeType: 'document';
    content: any[];
    data: {};
  };
  author: Entry<ContentfulAuthorFields>;
}

type ContentfulTeamMemberFields = {
  name: string;
  title: string;
  bio: string;
  image: Asset;
  specialties: string[];
}

export type BlogPost = Entry<ContentfulBlogPostFields>;
export type TeamMember = Entry<ContentfulTeamMemberFields>;

type BlogPostResponse = {
  id: string;
  title: string;
  slug: string;
  excerpt: string;
  featuredImage: Asset;
  author: Entry<ContentfulAuthorFields>;
  publishDate: string;
  content: {
    nodeType: 'document';
    content: any[];
    data: {};
  };
}

export async function getBlogPosts(): Promise<BlogPostResponse[]> {
  const response = await client.getEntries<ContentfulBlogPostFields>({
    content_type: 'blogPost',
    order: '-sys.createdAt',
  });

  return response.items.map((item) => {
    const { fields, sys } = item;
    return {
      id: sys.id,
      title: fields.title,
      slug: fields.slug,
      excerpt: fields.excerpt,
      featuredImage: fields.featuredImage,
      author: fields.author,
      publishDate: fields.publishDate,
      content: fields.content
    };
  });
}

export async function getBlogPost(slug: string): Promise<BlogPostResponse | null> {
  const response = await client.getEntries<ContentfulBlogPostFields>({
    content_type: 'blogPost',
    'fields.slug': slug,
    limit: 1,
  });

  if (!response.items[0]) return null;

  const { fields, sys } = response.items[0];
  return {
    id: sys.id,
    title: fields.title,
    slug: fields.slug,
    excerpt: fields.excerpt,
    featuredImage: fields.featuredImage,
    author: fields.author,
    publishDate: fields.publishDate,
    content: fields.content
  };
}

export async function getTeamMembers() {
  const response = await client.getEntries<ContentfulTeamMemberFields>({
    content_type: 'teamMember',
    order: 'fields.name',
  });

  return response.items.map((item) => {
    const { fields, sys } = item;
    return {
      id: sys.id,
      name: fields.name,
      title: fields.title,
      bio: fields.bio,
      image: fields.image,
      specialties: fields.specialties
    };
  });
}

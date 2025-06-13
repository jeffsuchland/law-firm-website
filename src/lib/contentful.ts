/// <reference types="astro/client" />
import { createClient, Entry, EntryCollection, Asset, EntrySkeletonType } from 'contentful';

// Check if environment variables are available
const hasContentfulCredentials = 
  typeof import.meta.env.CONTENTFUL_SPACE_ID === 'string' && 
  typeof import.meta.env.CONTENTFUL_ACCESS_TOKEN === 'string';

// Create a client if credentials are available, otherwise create a mock client
const client = hasContentfulCredentials 
  ? createClient({
      space: import.meta.env.CONTENTFUL_SPACE_ID,
      accessToken: import.meta.env.CONTENTFUL_ACCESS_TOKEN,
    })
  : {
      // Mock client methods for development without credentials
      getEntries: () => Promise.resolve({ items: [] }),
    } as any;

interface IContentfulAuthor extends EntrySkeletonType {
  fields: {
    name: string;
    title: string;
    image: Asset;
  };
  contentTypeId: 'author';
}

interface IContentfulBlogPost extends EntrySkeletonType {
  fields: {
    title: string;
    slug: string;
    publishDate: string;
    featuredImage: Asset;
    excerpt: string;
    content: {
      nodeType: 'document';
      content: any[];
      data: Record<string, unknown>;
    };
    author: Entry<IContentfulAuthor>;
  };
  contentTypeId: 'blogPost';
}

interface IContentfulTeamMember extends EntrySkeletonType {
  fields: {
    name: string;
    title: string;
    bio: string;
    image: Asset;
    specialties: string[];
  };
  contentTypeId: 'teamMember';
}

export type BlogPost = Entry<IContentfulBlogPost>;
export type TeamMember = Entry<IContentfulTeamMember>;

type BlogPostResponse = {
  id: string;
  title: string;
  slug: string;
  excerpt: string;
  featuredImage: Asset;
  author: Entry<IContentfulAuthor>;
  publishDate: string;
  content: {
    nodeType: 'document';
    content: any[];
    data: Record<string, unknown>;
  };
}

export async function getBlogPosts(): Promise<BlogPostResponse[]> {
  const response = await client.getEntries<IContentfulBlogPost>({
    content_type: 'blogPost',
    order: ['-sys.createdAt'] as const,
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
  const response = await client.getEntries<IContentfulBlogPost>({
    content_type: 'blogPost',
    limit: 1,
    'fields.slug': slug,
  } as any);

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

export type TeamMemberResponse = {
  id: string;
  name: string;
  title: string;
  bio: string;
  image: Asset;
  specialties: string[];
};

export async function getTeamMembers(): Promise<TeamMemberResponse[]> {
  const response = await client.getEntries<IContentfulTeamMember>({
    content_type: 'teamMember',
    order: ['sys.createdAt'] as const,
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

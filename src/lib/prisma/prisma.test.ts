import { describe, expect, it } from "bun:test";
import { prisma } from "@/lib/prisma";

// Be sure to remove this, after you remove test Post modal from schema.prisma

describe("CRUD Operations for Posts Test Modal", () => {
  const postData = {
    title: "Test Post",
    content: "This is a test post.",
  };

  const updatedPostData = {
    title: "Updated Test Post",
    content: "This is an updated test post.",
  };

  // Create a post
  it("should create a post", async () => {
    await prisma.post.create({
      data: {
        ...postData,
      },
    });
  });

  // Read the created post
  it("should retrieve the created post", async () => {
    const post = await prisma.post.findFirst({
      where: {
        title: postData.title,
      },
    });
    expect(post).not.toBeNull();
    expect(post?.title).toBe(postData.title);
    expect(post?.content).toBe(postData.content);
  });

  // Update the created post
  it("should update the created post", async () => {
    await prisma.post.updateMany({
      where: {
        title: postData.title,
      },
      data: {
        title: updatedPostData.title,
        content: updatedPostData.content,
      },
    });

    const updatedPost = await prisma.post.findFirst({
      where: {
        title: updatedPostData.title,
      },
    });
    expect(updatedPost).not.toBeNull();
    expect(updatedPost?.content).toBe(updatedPostData.content);
  });

  // Delete the created post
  it("should delete the created post", async () => {
    await prisma.post.deleteMany({
      where: {
        title: updatedPostData.title,
      },
    });
  });
});

describe("Database Cleanup", () => {
  it("should delete all posts", async () => {
    await prisma.post.deleteMany({});
  });
});

"use client";

import { api } from "~/trpc/react";
import styles from "../index.module.css";

export function List() {
  const [posts_list] = api.post.getAll.useSuspenseQuery();

  return (
    <div className={styles.showcaseContainer}>
      {posts_list[0] ? (
        posts_list.map((post) => {
          return (
            <div key={post.id}>
              <p className={styles.showcaseText}>Title post: {post.name}</p>
              <p className={styles.showcaseText}>
                Post was created at:{" "}
                {`${post.createdAt.toDateString()} ${post.createdAt.toLocaleTimeString()}`}
              </p>
              <br />
              <br />
            </div>
          );
        })
      ) : (
        <p className={styles.showcaseText}>You have no posts yet.</p>
      )}
    </div>
  );
}

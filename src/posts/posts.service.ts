import { Injectable, Logger, NotFoundException, UnprocessableEntityException } from '@nestjs/common';
import { PostModel } from './posts.interface';

@Injectable()
export class PostsService {
    private posts: Array<PostModel> = [];
    private readonly logger = new Logger(PostsService.name);

    /**
     * Find all posts
     * @returns {Array<PostModel>}
     */
    public findAll(): Array<PostModel> {
        return this.posts;
    }

    /**
     * Find one post by id
     * @param id Post id
     * @returns {PostModel}
     */
    public findOne(id: number): PostModel {
        const post: PostModel = this.posts.find(post => post.id === id);
        if(!post) {
            throw new NotFoundException('Post not found');
        }

        return post;
    }

    /**
     * Create a new post
     * @param post Post to create
     * @returns {PostModel}
     */
    public create(post: PostModel): PostModel {
        this.verifyPost(post);

        const titleExists: boolean = this.posts.some((item) => item.title === post.title);

        if(titleExists) throw new UnprocessableEntityException('Post title already exists');

        const maxId: number = Math.max(...this.posts.map((post) => post.id), 0);
        const id: number = maxId + 1;

        const nPost: PostModel = {
            ...post,
            id
        }

        this.posts.push(nPost);

        return nPost;
    }

    /**
     * Delete a post
     * @param id Post id
     */
    public delete(id: number): void {
        const index: number = this.posts.findIndex(post => post.id === id);

        if(index === -1) throw new NotFoundException('Post not found');

        this.posts.splice(index, 1);
    }

    /**
     * Update a post
     * @param id Post id
     * @param post Post to update
     * @returns {PostModel}
     */
    public update(id: number, post: PostModel): PostModel {
        this.logger.log(`Updating post with id: ${id}`);

        this.verifyPost(post);

        const index = this.posts.findIndex(post => post.id === id);

        if(index === -1 ) throw new NotFoundException('Post not found');

        const titleExists = this.posts.some((item) => item.title === post.title && item.id !== id);
        if(titleExists) throw new UnprocessableEntityException('Post title already exists');

        const nPost: PostModel = {
            ...post,
            id
        }

        this.posts[(id - 1)] = nPost;

        return nPost;
    }

    /**
     * Find all posts by category
     * @param search Search term
     * @returns {Array<PostModel>}
     */
    public search(search: string): Array<PostModel> {
        return this.posts.filter(post => post.title.includes(search) || post.body.includes(search));
    }

    /**
     * Verify post
     * @param post Post to verify
     */
    private verifyPost(post: PostModel): void {
        if(!post.title) throw new UnprocessableEntityException('Post title is required');
        if(!post.body) throw new UnprocessableEntityException('Post body is required');
        if(!post.category) throw new UnprocessableEntityException('Post category is required');
        if(!post.date) throw new UnprocessableEntityException('Post date is required');
    }
}

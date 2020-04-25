import request from 'supertest';

import app from '../../app';
import { AuthService } from '../../services/auth.service';
import { connectDB } from '../../config/connect_database';
import { transValidation, transSuccess } from '../../lang/en';
import { CategoryService } from '../../services/category.service';
import { DatabaseService } from '../../services/database.service';
connectDB();

describe('POST /api/v1/blogs', () => {
    let token: string;
    let categoryId: string;
    beforeEach(async () => {
        await DatabaseService.refreshDatabaseForTesting();
        await AuthService.register({
            name: 'Quan Nguyen',
            username: 'username_test',
            password: 'password_test',
            password_confirmation: 'password_test',
        });
        const category = await CategoryService.createCategory({
            name: 'Test',
        });
        const user = await AuthService.login({
            username: 'username_test',
            password: 'password_test',
        });
        token = 'Bearer ' + user;
        categoryId = category.id;
    });

    it('Can create blog', async () => {
        const result: any = await request(app)
            .post('/api/v1/blogs')
            .send({
                name: 'test',
                content: 'content_test',
                image: 'image_test',
                category_id: categoryId,
            })
            .set('Authorization', token);
        const { status, result_code, message, data } = result.body;
        expect(result_code).toBe(200);
        expect(message).toBe(transSuccess.blog.blog_created('test'));
        expect(status).toBe(true);
        expect(data.content).toBe('content_test');
        expect(data.name).toBe('test');
        expect(data.image).toBe('image_test');
    });

    it('Cannot create blog without request body', async () => {
        const result: any = await request(app)
            .post('/api/v1/blogs')
            .send({
                name: '',
                content: '',
                image: '',
                category_id: '',
            })
            .set('Authorization', token);
        const { status, result_code, message, data } = result.body;
        expect(result_code).toBe(400);
        expect(message).toEqual({
            name: transValidation.blog.name_incorrect,
            content: transValidation.blog.content_incorrect,
            image: transValidation.blog.image_incorrect,
            category_id: transValidation.blog.category_incorrect,
        });
        expect(data).toBeNull();
        expect(status).toBe(false);
    });

    it('Cannot create blog without token', async () => {
        const result: any = await request(app).post('/api/v1/blogs').send({
            name: 'test',
            content: 'content_test',
            image: 'image_test',
            category_id: categoryId,
        });
        expect(result.status).toBe(401);
    });
});

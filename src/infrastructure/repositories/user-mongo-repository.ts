import { User } from '@domain/entities/User';
import { UserRepository } from '@domain/repositories/UserRepository';
import { CreateUserQuery } from '@domain/types/user/CreateUserQuery';
import { UserModel, UserMongoDb } from '@infrastructure/models/user-model';

export class UserMongoRepository implements UserRepository {
  async createOne(query: CreateUserQuery): Promise<User> {
    const newUser = new UserModel({
      email: query.email,
      password: query.password,
    });

    const userDb = await newUser.save();

    return this.restoreUser(userDb);
  }

  async find(): Promise<User[]> {
    const usersDb = await UserModel.find();
    return usersDb.map(userDb => this.restoreUser(userDb));
  }

  async findByEmail(email: string): Promise<User | null> {
    const userDb = await UserModel.findOne({ email });
    return userDb ? this.restoreUser(userDb) : null;
  }

  async findById(id: string): Promise<User | null> {
    const userDb = await UserModel.findById(id);
    return userDb ? this.restoreUser(userDb) : null;
  }

  private restoreUser(userDb: UserMongoDb): User {
    return new User({
      email: userDb?.email,
      password: userDb?.password,
      id: userDb._id.toString(),
      createdAt: userDb?.createdAt,
    });
  }
}

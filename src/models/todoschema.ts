import mongoose, { Schema, Document } from "mongoose";

interface ITodoItem {
    text: string;
    completed: boolean;
}

const ItemSchema = new Schema<ITodoItem>({
    text: { type: String, required: true },
    completed: { type: Boolean, default: false }
});
export interface ITodo extends Document {

    userId: mongoose.Types.ObjectId;
    title: string;
    description: string;
    items: ITodoItem[];
}
const Todo: Schema = new Schema<ITodo>(
    {
        userId: {type: mongoose.Schema.Types.ObjectId,ref: "User",required: true },
        title: { type: String, required: true },
        description: { type: String},
        items: { type: [ItemSchema], default: [] }

    },
    { timestamps: true }

);

const TodoList = mongoose.model<ITodo>("TodoList", Todo);

export default TodoList;

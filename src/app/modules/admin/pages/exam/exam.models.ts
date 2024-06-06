import { IBoard, ICard, ILabel, IList, IMember } from 'app/modules/admin/apps/scrumboard/scrumboard.types';
import {IExam} from "./exam.types";

// -----------------------------------------------------------------------------------------------------
// @ Board
// -----------------------------------------------------------------------------------------------------
export class Exam implements Required<IExam>
{
    id: string | null;
    reason: string;
    date: string | null;

    /**
     * Constructor
     */
    constructor(exam: IExam)
    {
        this.id = exam.id || null;
        this.reason = exam.reason;
        this.date = exam.date;
    }
}


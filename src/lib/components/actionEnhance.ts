import type { ActionResult, SubmitFunction } from '@sveltejs/kit';
import type { Action } from 'svelte/action';
import toast, { type Renderable, type ValueOrFunction } from 'svelte-french-toast';
import { enhance } from '$app/forms';

type Success = Record<string, unknown> | undefined;
type Failure = Record<string, unknown> | undefined;

export type ValOrFn = ValueOrFunction<Renderable, ActionResult> //string | ((arg: ActionResult<Success, Failure>) => string);

export const actionEnhance: Action<HTMLFormElement, { loading: string; success: ValOrFn; error: ValOrFn }> = (formElement, params) => {
    const submitFn: SubmitFunction<Success, Failure> = (
    ) => {
        let doneHandler: ReturnType<SubmitFunction<Success, Failure>>;
        toast.promise(new Promise<ActionResult>((resolve, reject) => {
            doneHandler = async ({ result }) => {
                if (result.type == 'failure') {
                    return reject(result);
                }
                return resolve(result);
            };
        }),{
                loading: params.loading,
                success: params.success,
                error: params.error
            });

        return doneHandler;
    };
    // return submitFn
    return enhance(formElement, submitFn);
}

// export const actionEnhance: Action<HTMLFormElement, { loading: string; success: string; error: string }> = (
//     formElement,
//     { loading, success, error }
// ) => {
//     return enhance(formElement, () => {
//         let doneHandler;
//         toast.promise(
//             new Promise((resolve, reject) => {
//                 doneHandler = async ({ result }) => {
//                     if (Math.floor(result.status / 100) == 2) resolve('');
//                     else {
//                         reject();
//                     }
//                 };
//             }),
//             {
//                 loading,
//                 success,
//                 error
//             }
//         );

//         return doneHandler;
//     });
// };
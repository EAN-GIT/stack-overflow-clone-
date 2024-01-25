"use client";
import React, { useRef, useState } from "react";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "../ui/form";
import { useForm } from "react-hook-form";
import { AnswerSchema } from "@/lib/validation";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Editor } from "@tinymce/tinymce-react";
import { useTheme } from "@/app/context/ThemeProvider";
import { Button } from "../ui/button";
import Image from "next/image";
import { createAnswer } from "@/lib/actions/answer.action";
import { usePathname } from "next/navigation";

interface Props {
  question: string;
  questionId: string;
  authorId: string;
}

export const Answer = ({ question, questionId, authorId }: Props) => {
  const { mode } = useTheme();

  const pathname = usePathname();

  const [isSubmitting, setIsSubmitting] = useState(false);

  const editorRef = useRef(null);
  // decclare a useform
  const form = useForm<z.infer<typeof AnswerSchema>>({
    resolver: zodResolver(AnswerSchema),
    defaultValues: {
      answer: "",
    },
  });

  const handleCreateAnswer = async (values: z.infer<typeof AnswerSchema>) => {
    setIsSubmitting(true);

    try {
      await createAnswer({
        content: values.answer,
        author: JSON.parse(authorId),
        question: JSON.parse(questionId),
        path: pathname,
      });

      // clear form content prepping for new answer to be types
      form.reset();

      // reset editor
      if (editorRef.current) {
        const editor = editorRef.current as any;

        editor.setContent("");
      }
      // eslint-disable-next-line no-useless-catch
    } catch (error) {
      // console.log(error);
      throw error;
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      <div className="flex flex-col justify-between sm:flex-row sm:items-center sm:gap-2">
        <h4 className="paragraph-semibold text-dark400_light800">
          Write your answer here
        </h4>

        <Button
          onClick={() => {}}
          className="btn light-border-2 gap-1.5 rounded-md px-4 py-2.5 text-primary-500 shadow-none"
        >
          {/* generate an ai answer
           */}

          <Image
            src="/assets/icons/starts.svg"
            alt="star"
            width={12}
            height={12}
            className="object-contain"
          />
        </Button>
      </div>
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(handleCreateAnswer)}
          className=" mt-6 flex w-full flex-col gap-10"
        >
          {/* answer field  */}
          <FormField
            control={form.control}
            name="answer"
            render={({ field }) => (
              <FormItem className=" flex w-full flex-col  gap-3">
                <FormControl className="mt-3.5">
                  {/* add a Todo and editor comp === TINY MCE */}
                  <Editor
                    // Todo: work on the styling darkmode and env
                    apiKey="ecnx6s6i8wporc6dj3jl8ermzcqpojvg9g6iei7jh34ymi3w"
                    onInit={(evt, editor) => {
                      // @ts-ignore
                      editorRef.current = editor;
                    }}
                    onBlur={field.onBlur}
                    onEditorChange={(content) => field.onChange(content)}
                    init={{
                      plugins:
                        "ai tinycomments mentions anchor autolink charmap codesample emoticons image link lists media searchreplace table visualblocks wordcount checklist mediaembed casechange export formatpainter pageembed permanentpen footnotes advtemplate advtable advcode editimage tableofcontents mergetags powerpaste tinymcespellchecker autocorrect a11ychecker typography inlinecss",
                      toolbar:
                        "undo redo  | blocks fontfamily fontsize | bold italic underline strikethrough | link image media table mergetags | align lineheight | tinycomments | checklist numlist bullist indent outdent | emoticons charmap | removeformat",
                      content_style: "body {font-family:Inter font-siz:16px}",
                      skin: mode === "dark" ? "oxide-dark" : "oxide",
                      content_css: mode === "dark" ? "dark" : "light",
                      tinycomments_mode: "embedded",
                      tinycomments_author: "Author name",
                      mergetags_list: [
                        { value: "First.Name", title: "First Name" },
                        { value: "Email", title: "Email" },
                      ],

                      ai_request: (request: string, respondWith: any) =>
                        respondWith.string(() =>
                          Promise.reject(
                            new Error("See docs to implement AI Assistant"),
                          ),
                        ),
                    }}
                    initialValue=""
                  />
                </FormControl>

                <FormMessage className="text-red-500" />
              </FormItem>
            )}
          />
          <div className="flex justify-end">
            <Button
              className="primary-gradient w-fit text-white"
              type="submit"
              disabled={isSubmitting}
            >
              {isSubmitting ? "Submitting..." : "Submit"}
            </Button>
          </div>
        </form>
      </Form>
    </>
  );
};

export default Answer;

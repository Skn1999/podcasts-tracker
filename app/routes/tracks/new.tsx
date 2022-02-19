import React, { ChangeEvent } from "react";
import { InformationCircleIcon } from "@heroicons/react/solid";
import { ActionFunction, Form, json, redirect, useActionData } from "remix";
import { getSumitAsUser } from "~/utils/user";
import { createNewManualPodcast } from "~/utils/podcast";
import { ExclamationCircleIcon } from "@heroicons/react/solid";

type FormDetailsType = "manual" | "auto";

type ActionData = {
  fields?: {
    detailsType: string;
    podcastLink: string;
    podcastTitle: string;
    podcastDescription: string;
  };
  formError?: string;
  fieldErrors?: {
    podcastLink?: string | undefined;
    podcastTitle?: string | undefined;
    podcastDescription?: string | undefined;
  };
};

const badRequest = (data: ActionData) => {
  return json(data, { status: 400 });
};

const isAtleastXCharsLong = (
  x: unknown,
  parameterName: string,
  lengthToCheck: number = 3
) => {
  if (typeof x !== "string" || x.length < lengthToCheck)
    return `${parameterName} must be atleast ${lengthToCheck} characters long`;
};

export const action: ActionFunction = async ({ request }) => {
  const formData = await request.formData();

  const detailType = formData.get("detailstype");
  const podcastLink = formData.get("podcastLink") as string;
  const title = formData.get("podcastTitle") as string;
  const description = formData.get("podcastDescription") as string;

  console.log("type of detailType" + typeof detailType);
  console.log(detailType);

  if (typeof detailType !== "string") {
    return badRequest({ formError: "Form not submitted correctly" });
  }

  if (
    (typeof podcastLink !== "string" ||
      typeof title !== "string" ||
      typeof description !== "string") &&
    detailType === "manual"
  ) {
    return badRequest({ formError: "Form not submitted correctly" });
  }

  if (typeof podcastLink !== "string" && detailType === "auto") {
    return badRequest({ formError: "Form not submitted correctly" });
  }

  const sumit = await getSumitAsUser();

  const fields = {
    detailsType: detailType,
    podcastLink,
    podcastTitle: title,
    podcastDescription: description,
  };

  let fieldErrors = {};

  if (detailType === "auto") {
    fieldErrors = {
      podcastLink: isAtleastXCharsLong(podcastLink, "Podcast link", 3),
      podcastTitle: "",
    };
  }

  if (detailType === "manual") {
    fieldErrors = {
      podcastTitle: isAtleastXCharsLong(title, "Podcast title", 3),
      podcastLink: isAtleastXCharsLong(podcastLink, "Podcast link", 3),
    };
  }

  console.log("field errors calculated");

  if (Object.values(fieldErrors).some(Boolean)) {
    return badRequest({ fieldErrors, fields });
  }

  console.log("field errors check passed");

  switch (detailType) {
    case "manual": {
      const link = formData.get("podcastLink") as string;

      const newTrack = await createNewManualPodcast({
        title,
        description,
        link,
        loggedInUser: sumit,
      });

      if (!newTrack) {
        return badRequest({
          formError: "Error occured while saving details.",
          fields,
        });
      }
      return redirect("/tracks");
      // return newTrack;
    }
    case "auto": {
      return badRequest({ fields, formError: "Feature not implemented" });
    }

    default: {
      return badRequest({ fields, formError: "Not implemented" });
    }
  }
};

export const InputField = (props: React.HTMLProps<HTMLInputElement>) => {
  return (
    <input
      className={`block border border-slate-400 bg-white bg-opacity-10 w-full rounded-md p-2 focus:bg-white focus:text-gray-900 ${props.className}`}
      {...props}
    />
  );
};

export const InputError = ({ errorMessage }: { errorMessage: string }) => {
  return <span className="text-red-400">{errorMessage}</span>;
};

export default function NewTrackFormRoute() {
  const actionData = useActionData<ActionData>();

  const [formDetailsType, setFormDetailsType] =
    React.useState<FormDetailsType>("manual");

  React.useEffect(() => {
    if (actionData?.fields?.detailsType) {
      setFormDetailsType(actionData.fields.detailsType as FormDetailsType);
    }
  }, [actionData?.fields?.detailsType, setFormDetailsType]);

  const onFormDetailsChange = (event: ChangeEvent<HTMLInputElement>) => {
    setFormDetailsType(event.target.value as FormDetailsType);
  };

  return (
    <Form
      method="post"
      className="bg-white bg-opacity-5 border-b border-indigo-500 flex flex-col space-y-6 p-4 rounded-lg overflow-hidden w-1/2 max-w-lg mx-auto mt-12"
      aria-describedby={actionData?.formError ? "form-error-message" : ""}
    >
      <p className="text-white font-medium text-lg text-center border-b border-indigo-200 pb-4">
        Add the podcast
      </p>
      {actionData?.formError ? (
        <p className="bg-red-200 text-red-600 p-3 rounded overflow-hidden text-base leading-snug font-normal flex items-start space-x-2">
          <ExclamationCircleIcon className="text-current w-4 h-4" />
          <span className="text-sm">{actionData.formError}</span>
        </p>
      ) : null}
      <fieldset>
        <legend className="block text-sm">Details:</legend>
        <div className="flex items-center space-x-6 mt-2">
          <label className=" font-semibold text-white">
            <input
              className="appearance-none checked:bg-indigo-900 bg-white bg-opacity-50 ring-2 checked:border-4 border-white w-4 h-4 rounded-full mr-2"
              type="radio"
              name="detailstype"
              value="manual"
              defaultChecked={formDetailsType === "manual"}
              onChange={onFormDetailsChange}
            />
            Add yourself
          </label>
          <label className="font-semibold text-white">
            <input
              className="appearance-none checked:bg-indigo-900 bg-white bg-opacity-50 ring-2 checked:border-4 border-white w-4 h-4 rounded-full mr-2"
              type="radio"
              name="detailstype"
              value="auto"
              defaultChecked={formDetailsType === "auto"}
              onChange={onFormDetailsChange}
            />
            Auto Detect
          </label>
        </div>
      </fieldset>
      {formDetailsType === "auto" ? (
        <>
          <div>
            <label className="text-sm">
              Podcast Link:{" "}
              <InputField
                defaultValue={actionData?.fields?.podcastLink ?? ""}
                type="text"
                name="podcastLink"
              />
            </label>
            {actionData?.fieldErrors?.podcastLink ? (
              <InputError errorMessage={actionData.fieldErrors.podcastLink} />
            ) : null}
          </div>
          <div className="bg-indigo-200 bg-opacity-10 p-4 rounded overflow-hidden flex items-start space-x-2">
            <InformationCircleIcon className="w-6 h-6" />
            <p className="text-sm ">
              This process may take some time. Please be patient while
              submitting the form
            </p>
          </div>
        </>
      ) : (
        <>
          <div>
            <label className="text-sm">
              Podcast Title*: <InputField type="text" name="podcastTitle" />
            </label>
          </div>
          <div>
            <label className="text-sm">
              Podcast Description*:{" "}
              <InputField type="text" name="podcastDescription" />
            </label>
          </div>
          <div>
            <label className="text-sm">
              Podcast Link*: <InputField type="text" name="podcastLink" />
            </label>
          </div>
        </>
      )}
      <button
        className="bg-white rounded-md p-2 px-3 font-medium text-lg text-indigo-900 hover:shadow-lg  text-center"
        type="submit"
      >
        Submit
      </button>
    </Form>
  );
}

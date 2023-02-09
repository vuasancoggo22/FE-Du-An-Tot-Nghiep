import instance from "./instance";

export const feedbackAdd = (token, data) => {
  const header = {
    headers: {
      Authorization: `${token}`,
    },
  };
  return instance.post("/feedback/service", data, header);
};
// export const feedbackList = (token) => {
//   const header = {
//     headers: {
//       Authorization: `${token}`,
//     },
//   };
//   return instance.get("/feedback", header);
// }
export const feedbackList = () => {
  return instance.get("/feedback");
};
export const feedbackReply = (token, id, data) => {
  const header = {
    headers: {
      Authorization: `${token}`,
    },
  };
  return instance.put(`/reply-feedback/service/${id}`, data, header);
};

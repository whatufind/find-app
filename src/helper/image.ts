export const getImageUrl = (url: string): string => {
  const awsDomain = 'whatufind.s3.us-east-2.amazonaws.com';
  if (url?.includes(awsDomain)) {
    return url;
  }
  const imageName = url?.split('/')?.pop();
  return (
    'http://192.168.30.225:3000/uploads/' + imageName
  );
};

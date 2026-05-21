export const chunkText = (
  text: string,
  chunkSize = 400
) => {

  const chunks: string[] = [];

  for (
    let i = 0;
    i < text.length;
    i += chunkSize
  ) {
    chunks.push(
      text.slice(i, i + chunkSize)
    );
  }

  return chunks;
};
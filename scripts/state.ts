import { useLocation } from "react-router-dom";

export function useQueryParam(): [Map<string, string>, Error] {
  const { search } = useLocation();
  try {
    const q = new Map(
      search.substring(1).split("&").map((_) =>
        _.split("=") as [string, string]
      ),
    );
    return [q, null];
  } catch {
    return [null, new Error("Invalid query parameter: " + search)];
  }
}

export function useCurrentAlbumId(): string | undefined {
  const [q] = useQueryParam();
  return q.get("album");
}

export function useCurrentScoreId(): string | undefined {
  const [q] = useQueryParam();
  return q.get("score");
}

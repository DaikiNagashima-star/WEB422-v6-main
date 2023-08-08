import { useRouter } from "next/router";
import { Card, ListGroup, Button } from "react-bootstrap";
import { useAtom } from "jotai";
import { searchHistoryAtom } from "../store";
import styles from "@/styles/History.module.css";

function History() {
  const router = useRouter();
  const [searchHistory, setSearchHistory] = useAtom(searchHistoryAtom);

  let parsedHistory = [];
  if (!searchHistory) return null;

  searchHistory.map((h) => {
    let params = new URLSearchParams(h);
    let entries = params.entries();
    parsedHistory.push(Object.fromEntries(entries));
  });

  const historyClicked = (e, index) => {
    e.stopPropagation();
    router.push(`/artwork?${searchHistory[index]}`);
  };
  const removeHistoryClicked = (e, index) => {
    e.stopPropagation();
    setSearchHistory((current) => {
      let x = [...current];
      x.splice(index, 1);
      return x;
    });
  };
  return (
    <Card>
      <Card.Body>
        <Card.Title>Search History</Card.Title>
        {parsedHistory.length === 0 ? (
          <Card.Text>Nothing Here. Try searching for some artwork.</Card.Text>
        ) : (
          <ListGroup>
            {parsedHistory.map((historyItem, index) => (
              <ListGroup.Item
                key={index}
                onClick={(e) => historyClicked(e, index)}
                className={styles.historyListItem}
              >
                {Object.keys(historyItem).map((key) => (
                  <>
                    {key}: <strong>{historyItem[key]}</strong>&nbsp;
                  </>
                ))}
                <Button
                  className="float-end"
                  variant="danger"
                  size="sm"
                  onClick={(e) => removeHistoryClicked(e, index)}
                >
                  &times;
                </Button>
              </ListGroup.Item>
            ))}
          </ListGroup>
        )}
      </Card.Body>
    </Card>
  );
}

export default History;

import { useState } from "react";
import "./App.scss";
import { v4 as uuidv4 } from "uuid";

const CurrSeries = [
  {
    name: "The Punisher",
    epLength: 14,
  },
];
const CompletedSeries = [
  {
    name: "Spongebob",
    epLength: 354,
  },
];

export default function App() {
  const [seriesList, setSeriesList] = useState([]);
  const [completedSeriesList, setCompletedSeriesList] = useState([]);

  function deleteSeries(currSeries) {
    const updatedSeries = seriesList.filter(
      (series) => series.name !== currSeries
    );
    setSeriesList(updatedSeries);
  }

  function deleteCompletedSeries(currSeries) {
    const updatedSeries = completedSeriesList.filter(
      (series) => series.name !== currSeries
    );
    setCompletedSeriesList(updatedSeries);
  }

  function addNewSeries(newSeries) {
    setSeriesList([...seriesList, newSeries]);
  }

  function addSeriesToComplete(ClickedSeries) {
    setCompletedSeriesList([...completedSeriesList, ClickedSeries]);

    const updatedSeries = seriesList.filter(
      (series) => series.name !== ClickedSeries.name
    );
    setSeriesList(updatedSeries);
  }

  return (
    <main>
      <div className="app-container">
        <SeriesInputForm addNewSeries={addNewSeries} />
        <CurrentSeriesList
          seriesList={seriesList}
          deleteSeries={deleteSeries}
          addSeriesToComplete={addSeriesToComplete}
        />

        <CompletedSeriesList
          completedSeriesList={completedSeriesList}
          deleteCompletedSeries={deleteCompletedSeries}
        />
      </div>
    </main>
  );
}

function SeriesInputForm({ addNewSeries }) {
  const [seriesName, setSeriesName] = useState("");
  const [episodeLength, setEpisodeLength] = useState("");

  function handleEpisodeLength(epLength) {
    if (!isNaN(epLength)) {
      setEpisodeLength(epLength);
    }
  }

  function handleEpisodeInputChange(e) {
    const inputValue = e.target.value;
    if (!isNaN(inputValue)) {
      handleEpisodeLength(inputValue);
    }
  }

  function handleFormSubmit(e) {
    e.preventDefault();
    if (episodeLength > 0 && seriesName !== "") {
      const newSeries = {
        name: seriesName,
        epLength: episodeLength,
        id: uuidv4(),
      };
      addNewSeries(newSeries);
    }
    setSeriesName("");
    setEpisodeLength(0);
  }

  return (
    <form className="series-input" onSubmit={handleFormSubmit}>
      <h2>Add Series</h2>
      <input
        type="text"
        placeholder="Series name..."
        value={seriesName}
        onChange={(e) => setSeriesName(e.target.value)}
      />
      <input
        type="text"
        placeholder="Episodes length..."
        value={episodeLength}
        onChange={handleEpisodeInputChange}
      />
      <button>Add</button>
    </form>
  );
}

function CurrentSeriesList({ seriesList, deleteSeries, addSeriesToComplete }) {
  return (
    <>
      <p className="current">Current</p>
      <div className="curr-list-container">
        {seriesList.map((series) => (
          <CurrentSeries
            series={series}
            key={uuidv4()}
            deleteSeries={deleteSeries}
            addSeriesToComplete={addSeriesToComplete}
          />
        ))}
      </div>
    </>
  );
}

function CurrentSeries({ series, deleteSeries, addSeriesToComplete }) {
  const [episodeProgress, setEpisodeProgress] = useState(0);
  const seriesEpisodes = Number(series.epLength);
  const [episodesLeft, setEpisodesLeft] = useState(14);
  const reachedMaxEpisodes = seriesEpisodes === episodeProgress;

  function increaseEpisodeProgress() {
    if (episodeProgress < seriesEpisodes) {
      setEpisodeProgress((prevProgress) => prevProgress + 1);
      setEpisodesLeft(seriesEpisodes - episodeProgress - 1);
    }
  }

  function decreaseEpisodeProgress() {
    if (episodeProgress >= 1) {
      setEpisodeProgress((prevProgress) => prevProgress - 1);
      setEpisodesLeft(seriesEpisodes - episodeProgress + 1);
    }
  }

  return (
    <div className="curr-series">
      <p className="series-header">{series.name}</p>
      <div className="count-ep-container">
        <p>Episodes</p>
        <div className="episode-count-btn">
          <p className="series-episodes">
            {series.epLength}/{episodeProgress}
          </p>
          <div className="btn-up-down">
            <button onClick={increaseEpisodeProgress}>▴</button>
            <button onClick={decreaseEpisodeProgress}>▾</button>
          </div>
        </div>
        {episodesLeft > 0 ? (
          <p>{episodesLeft} episodes left</p>
        ) : (
          <p>Finished all epidsodes</p>
        )}

        <div className="fin-del-btns">
          {reachedMaxEpisodes && (
            <button
              className="finish-btn"
              onClick={() => addSeriesToComplete(series)}
            >
              Finish
            </button>
          )}
          <button
            className="delete-btn"
            onClick={(e) => deleteSeries(series.name)}
          >
            Delete
          </button>
        </div>
      </div>
    </div>
  );
}

///////// Completed Series
function CompletedSeriesList({ completedSeriesList, deleteCompletedSeries }) {
  return (
    <>
      <p className="current">Completed</p>
      <div className="curr-list-container">
        {completedSeriesList.map((series) => (
          <CurrentCompletedSeries
            series={series}
            key={uuidv4()}
            deleteCompletedSeries={deleteCompletedSeries}
          />
        ))}
      </div>
    </>
  );
}

function CurrentCompletedSeries({ series, deleteCompletedSeries }) {
  return (
    <div className="curr-series">
      <p className="series-header">{series.name}</p>
      <div className="count-ep-container">
        <div className="episode-count-btn">
          <p className="series-episodes"></p>
        </div>
        <div className="fin-del-btns">
          <button
            className="delete-btn"
            onClick={(e) => deleteCompletedSeries(series.name)}
          >
            Delete
          </button>
        </div>
      </div>
    </div>
  );
}

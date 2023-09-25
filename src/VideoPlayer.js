import React, { useState, useRef } from 'react';
import ExcelJS from 'exceljs';
import './VideoPlayer.css'; 

const VideoPlayer = () => {
  const [videoLink, setVideoLink] = useState('');
  const [comments, setComments] = useState([]);
  const [inputComment, setInputComment] = useState('');
  const videoRef = useRef(null);

  const handleVideoLinkChange = (event) => {
    setVideoLink(event.target.value);
  };

  const handleVideoSubmit = (event) => {
    event.preventDefault();
    // Extract video ID from the YouTube link
    const videoId = extractVideoId(videoLink);
    if (videoId) {
      fetchVideoDetails(videoId);
    } else {
      alert('Invalid YouTube video link!');
    }
  };

  const fetchVideoDetails = async (videoId) => {
    const apiKey = 'AIzaSyD--hwxU-ANmrurWpZ8qjfjbgKDOIZJNig'; // Replace with your YouTube Data API key
    const response = await fetch(`https://www.googleapis.com/youtube/v3/videos?part=snippet&id=${videoId}&key=${apiKey}`);
    const data = await response.json();
    if (data.items.length > 0) {
      loadVideoPlayer(videoId);
    } else {
      alert('Failed to fetch video details!');
    }
  };

  const loadVideoPlayer = (videoId) => {
    // Load YouTube iframe API
    const tag = document.createElement('script');
    tag.src = 'https://www.youtube.com/iframe_api';
    const firstScriptTag = document.getElementsByTagName('script')[0];
    firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);

    window.onYouTubeIframeAPIReady = () => {
      new window.YT.Player(videoRef.current, {
        videoId: videoId,
        events: {
          onStateChange: handleVideoStateChange
        }
      });
    };
  };

  const handleVideoStateChange = (event) => {
    // Listen for video playback events (e.g., pause, play)
    if (event.data === window.YT.PlayerState.PAUSED) {
      const currentTime = event.target.getCurrentTime();
      promptComment(currentTime);
    }
  };

  const promptComment = (timestamp) => {
    const comment = prompt('Enter your comment:');
    if (comment) {
      const newComment = {
        timestamp: timestamp,
        text: comment
      };
      setComments((prevComments) => [...prevComments, newComment]);
    }
  };

  const handleCommentChange = (event) => {
    setInputComment(event.target.value);
  };

  const handleSubmitComment = (event) => {
    event.preventDefault();
    if (inputComment.trim() !== '') {
      const newComment = {
        timestamp: 0,
        text: inputComment
      };
      setComments((prevComments) => [...prevComments, newComment]);
      setInputComment('');
    }
  };
  
  const formatTimestamp = (timestamp) => {
    const minutes = Math.floor(timestamp / 60);
    const seconds = Math.floor(timestamp % 60);
    return `${minutes}m${seconds}s`;
  };

  const deleteComment = (index) => {
    setComments((prevComments) => prevComments.filter((_, i) => i !== index));
  };

  const [name, setName] = useState('');

  const handleNameChange = (event) => {
    setName(event.target.value);
  };

  const handleExport = () => {
    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet('Comments');
  
    // Add column headers
    worksheet.getCell('A1').value = 'Timestamp';
    worksheet.getCell('B1').value = 'Comment';
    worksheet.getCell('C1').value = 'Comment Link';
  
    // Add comment data
    comments.forEach((comment, index) => {
      const rowIndex = index + 2; // Start from row 2 (index + 1 for 1-indexed rows)
      worksheet.getCell(`A${rowIndex}`).value = formatTimestamp(comment.timestamp);
      worksheet.getCell(`B${rowIndex}`).value = comment.text;
      const commentLink = `${videoLink}&t=${formatTimestamp(comment.timestamp)}`;
      const hyperlinkCell = worksheet.getCell(`C${rowIndex}`);
      hyperlinkCell.value = {
        text: comment.text,
        hyperlink: commentLink,
        tooltip: commentLink
      };
      hyperlinkCell.font = { color: { argb: '9dc183' } }; // Set font color to green
    });
  
    // Auto-fit column widths
    worksheet.columns.forEach((column) => {
      column.width = 20;
    });
  
    // Generate Excel file
    workbook.xlsx.writeBuffer().then((buffer) => {
      const blob = new Blob([buffer], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `${name}_comments.xlsx`;
      link.click();
    });
  };


  
  

  const renderComments = () => {
    return (
      <table className="comments-table">
        <thead>
          <tr>
            <th>Timestamp</th>
            <th>Comment</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          {comments.map((comment, index) => (
            <tr key={index} className={comment.timestamp === 0 ? 'highlight-row' : ''}>
              <td>{formatTimestamp(comment.timestamp)}</td>
              <td>
                <a
                  href={`${videoLink}&t=${formatTimestamp(comment.timestamp)}`}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  {comment.text}
                </a>
              </td>
              <td>
                <button className="delete-button" onClick={() => deleteComment(index)}>Delete</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    );
  };




  

  // Helper function to extract video ID from YouTube link
  const extractVideoId = (link) => {
    const videoIdMatch = link.match(/(?:[?&]v=|\/embed\/|\/[0-9a-z_-]{11})([0-9a-z_-]{11})/i);
    const unlistedIdMatch = link.match(/\/v\/([0-9a-z_-]{11})/i);
    return videoIdMatch ? videoIdMatch[1] : unlistedIdMatch ? unlistedIdMatch[1] : null;
  };

  return (
    <div className="video-player">
      <form onSubmit={handleVideoSubmit}>
        <input
          className="video-link-input"
          type="text"
          value={videoLink}
          onChange={handleVideoLinkChange}
          placeholder="Enter YouTube video link"
        />
        <input
          className="name-input"
          type="text"
          value={name}
          onChange={handleNameChange}
          placeholder="Enter your name"
        />
        <button className="submit-button" type="submit">Load Video</button>
      </form>
      <div className="video-container" ref={videoRef}></div>
      <div className="comments-section">
        <h2>Comments</h2>
        {renderComments()}
        <form onSubmit={handleSubmitComment}>
          <input
            className="comment-input"
            type="text"
            value={inputComment}
            onChange={handleCommentChange}
            placeholder="Enter your comment"
          />
          <button className="submit-button" type="submit">Add Comment</button>
        </form>
        <button className="export-button" onClick={handleExport}>Export to Excel</button>
      </div>
    </div>
  );
};

export default VideoPlayer;
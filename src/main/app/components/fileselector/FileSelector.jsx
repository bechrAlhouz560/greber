import React, { useState } from "react";
import "./file-selector.css";
import { useSelector } from "react-redux";
import { editCardActivity } from "../board/card/CardEditor.jsx";
import { useDispatch } from "react-redux";
import uploadFile from "../../../utils/upload";
import path from "path";
import { useEffect } from "react";
import { genID } from "../board/list/List.jsx";
import { copyFileActivity, toBase64 } from "../../../utils/copy";
import fs from "fs";
import { useContext } from "react";
import { ErrorContext } from "../../App.jsx";

export const fileTypes = {
  image: {
    ext: ["png", "jpeg", "jpg", "svg"],
    Img: function (src) {
      return (
        <div className="img-file">
          <img src={src} alt="" />
        </div>
      );
    },
  },
  doc: {
    ext: ["pdf", "docx"],
    img: (
      <span>
        <i className="fas fa-file-pdf    "></i>
      </span>
    ),
  },
  compressed: {
    ext: ["zip", "7z"],
    img: (
      <span>
        <i className="fa fa-archive" aria-hidden="true"></i>
      </span>
    ),
  },
  video: {
    ext: ["mp4", "avi", "webm", "mkv", "wmv"],
    img: (
      <span>
        <i class="fas fa-file-video    "></i>
      </span>
    ),
  },
};

export function getType(ext) {
  let img = (
    <span>
      <i className="fa fa-file" aria-hidden="true"></i>
    </span>
  );
  for (const extName in fileTypes) {
    let typeFound = fileTypes[extName].ext.indexOf(ext);
    if (typeFound !== -1) {
      img = fileTypes[extName].img || fileTypes[extName].Img;
      break;
    }
  }
  return img;
}

async function copyFile(file, activity, setError, dispatch) {
  try {
    let copied = await copyFileActivity(activity, file);
    editCardActivity(
      {
        ...activity,
        files: [
          ...(activity.files || []),
          {
            ...file,
            path: copied.newPath,
          },
        ],
      },
      dispatch
    );
  } catch (err) {
    console.log(err);
    setError(err);
  }
}

export const FileContainer = React.memo(function FileContainer({
  filePath,
  img,
}) {
  return <div className="file">{img}</div>;
});
export function File(props) {
  const { file, activity } = props;
  const [img, setImg] = useState("");
  const dispatch = useDispatch();
  function delFile() {
    let newFiles = activity.files.filter(function (_file) {
      if (_file.id !== file.id) {
        return _file;
      }
    });
    editCardActivity({ ...activity, files: newFiles }, dispatch);
  }
  useEffect(
    function () {
      const ac = new AbortController();
      let exists = fs.existsSync(file.path);
      if (exists) {
        let type = getType(path.extname(file.path).split(".")[1].toLowerCase());

        if (typeof type === "function") {
          toBase64(file.path, "image").then(function (base) {
            setImg(type(base));
          });
        } else {
          setImg(type);
        }
      } else {
        delFile();
      }
      return () => ac.abort();
    },
    [props]
  );
  return <FileContainer filePath={file.path} img={img} />;
}

export const FileList = React.memo(
  function FileList({ files, activity }) {
    return files.map(function (file, index) {
      return <File file={file} activity={activity} key={index} />;
    });
  },
  function (left, right) {
    return left.files.length === right.files.length;
  }
);
export default function FileSelector(props) {
  const { isEditing } = props;
  const { setError } = useContext(ErrorContext);
  let activity = useSelector(function (state) {
    for (let act of state.cardActivity) {
      if (act.id === props.activity.id) {
        return act;
      }
    }
  });

  let dispatch = useDispatch();

  return (
    <div
      className="file-selector"
      style={{
        padding: !activity.files ? "0px 0px" : "",
      }}
    >
      <div className="files-list">
        {isEditing ? (
          <div
            className="add-file"
            onClick={async function () {
              try {
                let file = await uploadFile(
                  "Upload a file for activity",
                  "",
                  false,
                  []
                );
                if (file) {
                  let file_id = genID(10 ** 10);
                  let file_infos = {
                    path: file,
                    id: file_id,
                    created_at: new Date(),
                  };
                  await copyFile(file_infos, activity, setError, dispatch);
                }
              } catch (err) {
                setError(err);
              }
            }}
          >
            <span>
              <i className="fa fa-plus-circle" aria-hidden="true"></i>
            </span>
          </div>
        ) : (
          ""
        )}
        {activity.files ? (
          <FileList files={activity.files} activity={activity} />
        ) : (
          ""
        )}
      </div>
    </div>
  );
}

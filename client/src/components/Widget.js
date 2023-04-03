import React from 'react';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import CardMedia from '@mui/material/CardMedia';
import Typography from '@mui/material/Typography';
import news1 from '../assets/news1.jpg';
import news2 from '../assets/news2.jpg';
import news3 from '../assets/news3.jpg';
import "../styles/Widget.css";

function Widget() {
  return (
    <div className="widget">
        <Card sx={{ maxWidth: 355 }}>
      <CardMedia
        component="img"
        height="200"
        image={news2}
        alt="news2"
      />
      <CardContent>
        <Typography gutterBottom variant="h6" component="div">
        ‘Swift’ work by UCLan volunteers saves birds
        </Typography>
        <Typography variant="body2" color="text.secondary">
        A quartet of technicians create nesting kits for RSPB
        </Typography>
      </CardContent>
    </Card>
   <Card sx={{ maxWidth: 355 }}>
      <CardMedia
        component="img"
        height="200"
        image={news1}
        alt="news1"
      />
      <CardContent>
        <Typography gutterBottom variant="h6" component="div">
        UCLan to send out signal to E.T.
        </Typography>
        <Typography variant="body2" color="text.secondary">
        Jeremiah Horrocks Institute will play a key role in sending out a message to potential other life 
        forms within the Universe via a specialised radio telescope
        </Typography>
      </CardContent>
    </Card>
    <Card sx={{ maxWidth: 355 }}>
      <CardMedia
        component="img"
        height="200"
        image={news3}
        alt="news3"
      />
      <CardContent>
        <Typography gutterBottom variant="h6" component="div">
        Elite Netball Academy partners with UCLan
        </Typography>
        <Typography variant="body2" color="text.secondary">
        UCLan has officially partnered with Elite Netball Academy to 
        develop its performance team and scholarship recruitment through performance training and support 
        </Typography>
      </CardContent>
    </Card>
    </div>
  )
}

export default Widget
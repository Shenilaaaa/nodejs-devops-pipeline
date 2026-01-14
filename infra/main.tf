provider "aws" {
  region = var.region
}

resource "aws_vpc" "main_vpc" {
  cidr_block = "10.0.0.0/16"
}

resource "aws_subnet" "main_subnet" {
  vpc_id                  = aws_vpc.main_vpc.id
  cidr_block              = "10.0.1.0/24"
  map_public_ip_on_launch = true
}

# Create an Internet Gateway
resource "aws_internet_gateway" "main_igw" {
  vpc_id = aws_vpc.main_vpc.id

  tags = {
    Name = "devops-case2-igw"
  }
}

# Create a Public Route Table
resource "aws_route_table" "main_rt" {
  vpc_id = aws_vpc.main_vpc.id

  tags = {
    Name = "devops-case2-public-rt"
  }
}

# Add a route for internet traffic
resource "aws_route" "default_route" {
  route_table_id         = aws_route_table.main_rt.id
  destination_cidr_block = "0.0.0.0/0"
  gateway_id             = aws_internet_gateway.main_igw.id
}

# Associate the route table with your subnet
resource "aws_route_table_association" "main_rta" {
  subnet_id      = aws_subnet.main_subnet.id
  route_table_id = aws_route_table.main_rt.id
}

resource "aws_security_group" "web_sg" {
  name        = "web_sg"
  description = "Allow HTTP, HTTPS, and SSH"
  vpc_id      = aws_vpc.main_vpc.id

  ingress {
    from_port   = 22
    to_port     = 22
    protocol    = "tcp"
    cidr_blocks = ["0.0.0.0/0"]
  }

  ingress {
    from_port   = 80
    to_port     = 80
    protocol    = "tcp"
    cidr_blocks = ["0.0.0.0/0"]
  }

  ingress {
    from_port   = 443
    to_port     = 443
    protocol    = "tcp"
    cidr_blocks = ["0.0.0.0/0"]
  }

  egress {
    from_port   = 0
    to_port     = 0
    protocol    = "-1"
    cidr_blocks = ["0.0.0.0/0"]
  }
}

resource "aws_instance" "web_instance" {
  ami                     = "ami-021589336d307b577"
  instance_type           = var.instance_type
  subnet_id               = aws_subnet.main_subnet.id
  vpc_security_group_ids  = [aws_security_group.web_sg.id]
  associate_public_ip_address = true
  key_name                = "devops-case2-key"  # <-- Make sure this line exists and is correct

  tags = {
    Name = "devops-case2-instance"
  }
}
